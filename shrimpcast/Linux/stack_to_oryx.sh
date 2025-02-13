handle_error() {
    echo "Error: $1"
    exit 1
}

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

# Uninstall SRS Stack
echo "Uninstalling SRS Stack..."
download_url="https://github.com/ossrs/srs-stack/releases/download/v5.12.21/linux-srs_stack-en.tar.gz"
download_dest="/tmp/linux-srs_stack-en.tar.gz"
extracted_dir="/tmp/srs_stack"

# Remove temp directory if it exists
rm -rf $extracted_dir

wget -O $download_dest $download_url || handle_error "Failed to download the file from $download_url"
mkdir -p $extracted_dir || handle_error "Failed to create directory $extracted_dir"
tar -xzf $download_dest -C $extracted_dir || handle_error "Failed to extract $download_dest to $extracted_dir"
setup_dir="$extracted_dir/srs_stack/scripts/setup-ubuntu"
cd $setup_dir || handle_error "Failed to navigate to $setup_dir"
chmod +x uninstall.sh || handle_error "Failed to give execute permission to uninstall.sh"
./uninstall.sh || handle_error "Failed to execute uninstall.sh"
echo "SRS Stack uninstalled successfully."

# Download and install Oryx
echo "Downloading and installing Oryx..."
download_url="https://github.com/ossrs/oryx/releases/download/v5.14.25/linux-oryx-en.tar.gz"
download_dest="/tmp/linux-oryx-en.tar.gz"
wget -O $download_dest $download_url || handle_error "Failed to download the file from $download_url"
extracted_dir="/tmp/oryx"
mkdir -p $extracted_dir || handle_error "Failed to create directory $extracted_dir"
tar -xzf $download_dest -C $extracted_dir || handle_error "Failed to extract $download_dest to $extracted_dir"
sed -i 's/HTTPS_PORT=2443/HTTPS_PORT=2053/' $extracted_dir/oryx/mgmt/bootstrap
setup_dir="$extracted_dir/oryx/scripts/setup-ubuntu"
cd $setup_dir || handle_error "Failed to navigate to $setup_dir"
./install.sh || handle_error "Failed to execute install.sh"
echo "Oryx installed successfully."

# Install the certificate
CERT=$(echo "/etc/letsencrypt/live/{0}" | sed "s/{0}/$DOMAIN/");
while ! docker inspect -f '{{.State.Running}}' oryx &>/dev/null; do
    sleep 1
done

cat $CERT/privkey.pem | docker exec -i oryx sh -c 'cat > /usr/local/oryx/platform/containers/data/config/nginx.key'
cat $CERT/fullchain.pem | docker exec -i oryx sh -c 'cat > /usr/local/oryx/platform/containers/data/config/nginx.crt'
systemctl restart oryx
