# Remote desktop setup
curl https://dl.google.com/linux/linux_signing_key.pub | sudo gpg --dearmor -o /etc/apt/trusted.gpg.d/chrome-remote-desktop.gpg
echo "deb [arch=amd64] https://dl.google.com/linux/chrome-remote-desktop/deb stable main" | sudo tee /etc/apt/sources.list.d/chrome-remote-desktop.list
sudo apt-get update
sudo DEBIAN_FRONTEND=noninteractive apt-get install --assume-yes chrome-remote-desktop

# Set up Chrome Remote Desktop session
sudo bash -c 'echo "exec /etc/X11/Xsession /usr/bin/cinnamon-session-cinnamon2d" > /etc/chrome-remote-desktop-session'

# Install cinnamon-core and desktop-base
sudo DEBIAN_FRONTEND=noninteractive apt install --assume-yes cinnamon-core desktop-base dbus-x11

# Install VLC
sudo apt install vlc

# Install Firefox
sudo apt install firefox

# Install Stremio
wget https://dl.strem.io/shell-linux/v4.4.168/stremio_4.4.168-1_amd64.deb
sudo chmod +x stremio_4.4.168-1_amd64.deb
sudo dpkg -i stremio_4.4.168-1_amd64.deb
sudo apt-get -f install
wget http://nz2.archive.ubuntu.com/ubuntu/pool/main/o/openssl/libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo dpkg -i libssl1.1_1.1.1f-1ubuntu2_amd64.deb
sudo dpkg -i stremio_4.4.168-1_amd64.deb

# Install OBS Studio
sudo add-apt-repository ppa:obsproject/obs-studio
sudo apt install obs-studio
sudo ufw disable
wget https://github.com/WarmUpTill/SceneSwitcher/releases/download/1.25.3/advanced-scene-switcher-1.25.3-x86_64-linux-gnu.deb
sudo dpkg -i advanced-scene-switcher-1.25.3-x86_64-linux-gnu.deb
sudo apt-get -f install
sudo dpkg -i advanced-scene-switcher-1.25.3-x86_64-linux-gnu.deb

# GRDP setup
sudo adduser obs
sudo usermod -aG sudo obs
su obs
