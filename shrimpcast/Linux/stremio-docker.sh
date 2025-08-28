sudo ufw allow 11470
sudo ufw route allow proto tcp from any to any port 11470

docker run -d \
  --name=stremio-docker \
  -e NO_CORS=1 \
  -e AUTO_SERVER_URL=1 \
  -v ./stremio-data:/root/.stremio-server \
  -p 11470:11470/tcp \
  --restart unless-stopped \
  tsaridas/stremio-docker:latest