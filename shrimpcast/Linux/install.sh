#!/bin/bash

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

APPLICATION=""
NGINX=""
SKIP_DOTNET=false

# Check ubuntu version
source /etc/os-release
if [ "$ID" != "ubuntu" ] || [ "$VERSION_ID" != "24.04" ]; then
  echo "This script requires Ubuntu 24.04"
  exit 1
fi

# Check root
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

# Stop and mask automatic APT scheduling.
systemctl disable --now apt-daily.timer apt-daily-upgrade.timer unattended-upgrades.service 2>/dev/null || true
systemctl mask apt-daily.timer apt-daily-upgrade.timer apt-daily.service apt-daily-upgrade.service

# Remove unattended upgrades.
apt-get purge -y unattended-upgrades || {
    echo "ERROR: Failed to purge unattended-upgrades."
    exit 1
}

# Disable APT periodic activity and automatic reboot settings.
rm -f /etc/apt/apt.conf.d/20auto-upgrades
rm -f /etc/apt/apt.conf.d/50unattended-upgrades
rm -rf /etc/apt/apt.conf.d/50unattended-upgrades.d
printf 'APT::Periodic::Update-Package-Lists "0";\nAPT::Periodic::Unattended-Upgrade "0";\n' \
    > /etc/apt/apt.conf.d/99-disable-automatic-updates

# Prevent needrestart from automatically restarting services.
mkdir -p /etc/needrestart/conf.d
printf "\$nrconf{restart} = 'l';\n" \
    > /etc/needrestart/conf.d/99-no-auto-restart.conf

# Remove unattended-upgrades state and logs.
rm -rf /var/log/unattended-upgrades /var/lib/unattended-upgrades

systemctl daemon-reload

# Verify package removal.
if dpkg-query -W -f='${db:Status-Status}' unattended-upgrades 2>/dev/null | grep -qx installed; then
    echo "ERROR: unattended-upgrades is still installed."
    exit 1
fi

# Verify APT timers and services are masked.
for unit in apt-daily.timer apt-daily-upgrade.timer apt-daily.service apt-daily-upgrade.service; do
    if [[ "$(systemctl is-enabled "$unit" 2>/dev/null)" != masked ]]; then
        echo "ERROR: $unit is not masked."
        exit 1
    fi
done

# Verify automatic update settings.
if ! apt-config dump | grep -q 'APT::Periodic::Update-Package-Lists "0"'; then
    echo "ERROR: Automatic package-list updates are not disabled."
    exit 1
fi

if ! apt-config dump | grep -q 'APT::Periodic::Unattended-Upgrade "0"'; then
    echo "ERROR: Automatic package upgrades are not disabled."
    exit 1
fi

# Verify needrestart configuration.
if ! grep -Fqx "\$nrconf{restart} = 'l';" /etc/needrestart/conf.d/99-no-auto-restart.conf; then
    echo "ERROR: needrestart auto-restart prevention is not configured."
    exit 1
fi

# Verify no unattended-upgrade process remains.
if pgrep -af '[u]nattended-upgrade'; then
    echo "ERROR: An unattended-upgrade process is still running."
    exit 1
fi

echo "Automatic APT updates disabled; needrestart configured not to restart services automatically."

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
apt-get update && apt-get install nginx libnginx-mod-rtmp -y || handle_error "Failed to install nginx"

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

if [ "$SKIP_DOTNET" = false ]; then
    apt-get install -y dotnet-sdk-10.0 || handle_error "Failed to install .NET SDK 10.0"
fi

dotnet dev-certs https

# Install ffmpeg
sudo apt-get install -y ffmpeg

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

# Install UFW if not already installed
sudo apt install ufw

# Reset UFW to default settings
sudo ufw --force reset 

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow specific TCP traffic
sudo ufw allow OpenSSH
sudo ufw allow 443
sudo ufw allow 1935

# Enable UFW with the configured rules
sudo ufw --force enable

# Set stream permissions
sudo chown -R root:www-data /root/shrimpcast
sudo chmod -R 750 /root/shrimpcast
sudo chmod 711 /root

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
