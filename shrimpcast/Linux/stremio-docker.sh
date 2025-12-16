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

docker run -d \
  --name=stremio-docker \
  -e NO_CORS=1 \
  -e AUTO_SERVER_URL=1 \
  -v ./stremio-data:/root/.stremio-server \
  -p 11470:11470/tcp \
  --restart unless-stopped \
  tsaridas/stremio-docker:latest