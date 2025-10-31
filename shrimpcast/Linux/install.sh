#!/bin/bash

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

APPLICATION=""
NGINX=""
SKIP_DOTNET=false

if [ "$(id -u)" -ne 0 ]; then
    echo "This script requires root privileges. Please run this script as root (sudo -i)."
    exit 1
fi

# Parse command-line options
DOMAIN=""
while [[ $# -gt 0 ]]; do
  case $1 in
    -d)
      DOMAIN="$2"
      shift 2
      ;;
    --skipdotnet)
      SKIP_DOTNET=true
      shift
      ;;
    *)
      echo "Invalid option: $1" >&2
      exit 1
      ;;
  esac
done

if [ -z "$DOMAIN" ]; then
  echo "Error: -d (DOMAIN) parameter is required."
  exit 1
fi

if [ "$SKIP_DOTNET" = true ]; then
  echo "Skipping .NET installation."
else
  echo "Proceeding with .NET installation."
fi

echo "Using domain: $DOMAIN"

# Check if UFW is installed
if command -v ufw &> /dev/null
then
    # Disable UFW for DNS auth
    sudo ufw disable
fi

# Install unzip package
apt-get update && apt-get install unzip -y || handle_error "Failed to install unzip"

# Download shrimpcast.zip
wget -O /root/shrimpcast.zip "$APPLICATION" || handle_error "Failed to download shrimpcast.zip"

# Extract shrimpcast.zip to /root/shrimpcast
unzip -q /root/shrimpcast.zip -d /root/shrimpcast || handle_error "Failed to extract shrimpcast.zip"
rm /root/shrimpcast.zip || handle_error "Failed to delete shrimpcast.zip"

# Download nginx.zip
wget -O /root/nginx.zip "$NGINX" || handle_error "Failed to download nginx.zip"

# Extract nginx.zip
unzip -q /root/nginx.zip -d /root/nginx_tmp || handle_error "Failed to extract nginx.zip"
rm /root/nginx.zip || handle_error "Failed to delete nginx.zip"

# Install nginx
apt-get update && apt-get install nginx -y || handle_error "Failed to install nginx"

# Install certificate
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
sudo certbot certonly --nginx -d "$DOMAIN" --non-interactive --agree-tos -m fake@mail.com
sudo chmod -R +r /etc/letsencrypt

# Replace default site with contents of 'default' file
mv /root/nginx_tmp/default /etc/nginx/sites-available/default || handle_error "Failed to replace default site"
sed -i "s/{0}/$DOMAIN/g" /etc/nginx/sites-available/default
sed -i "s/{0}/$DOMAIN/g" /root/shrimpcast/wwwroot/manifest.json

# Replace nginx.conf with contents of 'nginx.conf' file
mv /root/nginx_tmp/nginx.conf /etc/nginx/nginx.conf || handle_error "Failed to replace nginx.conf"

# Restart Nginx to apply the new configuration
systemctl restart nginx || handle_error "Failed to restart Nginx"

# Install PostgreSQL
apt-get install postgresql -y || handle_error "Failed to install PostgreSQL"

# Change default PostgreSQL password to '$rhimpca$t'
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD '\$hrimpca\$t';" || handle_error "Failed to change default PostgreSQL password"

# Set execution permissions for shrimpcast
chmod +x /root/shrimpcast/shrimpcast || handle_error "Failed to set execution permissions for shrimpcast"

# Clean up temporary files
rm -rf /root/nginx_tmp

# Get Ubuntu version
declare repo_version=$(if command -v lsb_release &> /dev/null; then lsb_release -r -s; else grep -oP '(?<=^VERSION_ID=).+' /etc/os-release | tr -d '"'; fi)

if [ "$SKIP_DOTNET" = false ]; then
    # Download Microsoft signing key and repository
    wget https://packages.microsoft.com/config/ubuntu/$repo_version/packages-microsoft-prod.deb -O /root/packages-microsoft-prod.deb || handle_error "Failed to download Microsoft signing key and repository"
    
    # Install Microsoft signing key and repository
    dpkg -i /root/packages-microsoft-prod.deb || handle_error "Failed to install Microsoft signing key and repository"
    
    # Clean up
    rm /root/packages-microsoft-prod.deb || handle_error "Failed to remove packages-microsoft-prod.deb"
    
    # Update packages
    apt update || handle_error "Failed to update packages"
    
    # Install .NET SDK 8.0
    apt-get update && \
      apt-get install -y dotnet-sdk-8.0 || handle_error "Failed to install .NET SDK 8.0"
fi

dotnet dev-certs https

# Install ffmpeg
sudo add-apt-repository ppa:ubuntuhandbook1/ffmpeg7
sudo apt-get update
sudo apt-get install ffmpeg

# Create systemd service file
cat <<EOF | tee /etc/systemd/system/shrimpcast.service >/dev/null
[Unit]
Description=Shrimpcast service
After=network.target

[Service]
User=root
Environment="DOTNET_ROOT=/usr/share/dotnet"
Environment="ASPNETCORE_ENVIRONMENT=Production"
ExecStart=/root/shrimpcast/shrimpcast
WorkingDirectory=/root/shrimpcast
Restart=always
RestartSec=10
SyslogIdentifier=shrimpcast
Type=notify

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd manager configuration
systemctl daemon-reload || handle_error "Failed to reload systemd manager configuration"

# Enable and start the service
systemctl enable shrimpcast || handle_error "Failed to enable shrimpcast service"
systemctl start shrimpcast || handle_error "Failed to start shrimpcast service"

echo "Shrimpcast installed successfully."

# Install TOR nodes
TOR_EXIT_NODES_URL="https://www.dan.me.uk/torlist/?exit"
export PGPASSWORD='$hrimpca$t'

# Download the file and pass its contents directly to psql using process substitution
psql -U "postgres" -h "localhost" -p "5432" -d "shrimpcast" -c "
    DELETE FROM public.\"TorExitNode\";
    CREATE TEMP TABLE temp_tor_exit_nodes (
        ip_address TEXT
    );
    COPY temp_tor_exit_nodes (ip_address) FROM PROGRAM 'curl -sS $TOR_EXIT_NODES_URL';
    INSERT INTO public.\"TorExitNode\" (\"RemoteAddress\")
    SELECT ip_address FROM temp_tor_exit_nodes;
"

echo "net.core.somaxconn=32768" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

echo "net.ipv4.tcp_max_syn_backlog=16384" | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Set file descriptor limit
NOFILE_LIMIT=524288
echo "Setting global file descriptor limits to $NOFILE_LIMIT..."

# Update /etc/security/limits.conf
echo "Updating /etc/security/limits.conf..."
cat > /etc/security/limits.conf << EOF
# /etc/security/limits.conf
#
# Each line describes a limit for a user in the form:
# <domain> <type> <item> <value>
#
# Global ulimits applied by script
* soft nofile $NOFILE_LIMIT
* hard nofile $NOFILE_LIMIT
root soft nofile $NOFILE_LIMIT
root hard nofile $NOFILE_LIMIT
# End of file
EOF

# Ensure PAM is set up to use limits.conf
echo "Ensuring PAM is configured to use limits..."
if ! grep -q "pam_limits.so" /etc/pam.d/common-session; then
    echo "session required pam_limits.so" >> /etc/pam.d/common-session
fi

# Update systemd defaults
echo "Configuring systemd default limits..."
mkdir -p /etc/systemd/system.conf.d/
cat > /etc/systemd/system.conf.d/limits.conf << EOF
[Manager]
DefaultLimitNOFILE=$NOFILE_LIMIT
EOF

echo "Setup completed successfully. Admin key: $(cat /root/shrimpcast/setup/GeneratedAdminToken.txt)"
echo "Rebooting to apply system wide changes"
sleep 0.5
reboot
