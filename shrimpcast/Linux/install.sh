#!/bin/bash

# Function to handle errors
handle_error() {
    echo "Error: $1"
    exit 1
}

APPLICATION=""
NGINX=""

if [ "$(id -u)" -ne 0 ]; then
    echo "This script requires root privileges. Please run this script as root (sudo -i)."
    exit 1
fi

# Parse command-line options
DOMAIN=""
while getopts ":d:" opt; do
  case $opt in
    d)
      DOMAIN="$OPTARG"
      ;;
    \?)
      echo "Invalid option: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

# Shift the option arguments to handle positional arguments if any
shift $((OPTIND - 1))

# Check if the DOMAIN parameter is provided
if [ -z "$DOMAIN" ]; then
  echo "Error: -d (DOMAIN) parameter is required."
  exit 1
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

dotnet dev-certs https

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

# Media server installation
# Install Docker
echo "Installing Docker..."
apt update || handle_error "Failed to update package index"
apt install -y apt-transport-https ca-certificates curl gnupg lsb-release || handle_error "Failed to install Docker prerequisites"
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg || handle_error "Failed to add Docker's GPG key"
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null || handle_error "Failed to set up Docker repository"
apt update || handle_error "Failed to update package index after adding Docker repository"
apt install -y docker-ce docker-ce-cli containerd.io || handle_error "Failed to install Docker Engine"
docker --version || handle_error "Docker installation verification failed"
usermod -aG docker $USER || handle_error "Failed to add user to docker group"
echo "Docker installed successfully."

# Download and install SRS Stack
echo "Downloading and installing SRS Stack..."
download_url="https://github.com/ossrs/srs-stack/releases/download/v5.12.21/linux-srs_stack-en.tar.gz"
download_dest="/tmp/linux-srs_stack-en.tar.gz"
wget -O $download_dest $download_url || handle_error "Failed to download the file from $download_url"
extracted_dir="/tmp/srs_stack"
mkdir -p $extracted_dir || handle_error "Failed to create directory $extracted_dir"
tar -xzf $download_dest -C $extracted_dir || handle_error "Failed to extract $download_dest to $extracted_dir"
sed -i 's/HTTPS_PORT=2443/HTTPS_PORT=2053/' $extracted_dir/srs_stack/mgmt/bootstrap
setup_dir="$extracted_dir/srs_stack/scripts/setup-ubuntu"
cd $setup_dir || handle_error "Failed to navigate to $setup_dir"
./install.sh || handle_error "Failed to execute install.sh"
echo "SRS Stack installed successfully."

# Install the certificate
CERT=$(echo "/etc/letsencrypt/live/{0}" | sed "s/{0}/$DOMAIN/");
while ! docker inspect -f '{{.State.Running}}' srs-stack &>/dev/null; do
    sleep 1
done

cat $CERT/privkey.pem | docker exec -i srs-stack sh -c 'cat > /usr/local/srs-stack/platform/containers/data/config/nginx.key'
cat $CERT/fullchain.pem | docker exec -i srs-stack sh -c 'cat > /usr/local/srs-stack/platform/containers/data/config/nginx.crt'
systemctl restart srs-stack

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

echo "Setup completed successfully. Admin key: $(cat /root/shrimpcast/setup/GeneratedAdminToken.txt)"
