#!/bin/bash
# VNC Server with XFCE Desktop Environment Setup Script for Ubuntu
# This script installs and configures TigerVNC server with XFCE

set -e  # Exit on any error

# Configuration
VNC_PORT="5901"
VNC_USER=$(whoami)
VNC_HOME=$HOME

if [[ $EUID -eq 0 ]]; then
    echo "ERROR: This script should not be run as root!"
    exit 1
fi

echo "Starting VNC Server Setup..."
echo "User: $VNC_USER"
echo "Home: $VNC_HOME"

# Update system (requires sudo for system packages)
echo "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required packages (requires sudo for system packages)
echo "Installing required packages..."
sudo apt install -y \
    tigervnc-standalone-server \
    tigervnc-common \
    tigervnc-tools \
    xfce4 \
    xfce4-goodies \
    dbus-x11 \
    xterm

echo "Packages installed successfully"

# Create .vnc directory if it doesn't exist
mkdir -p $VNC_HOME/.vnc

# Set VNC password (run as user, not root)
echo "Setting VNC password for user $VNC_USER..."
vncpasswd

# Create xstartup script
echo "Creating VNC startup script..."
cat > $VNC_HOME/.vnc/xstartup << 'EOF'
#!/bin/bash
unset SESSION_MANAGER
unset DBUS_SESSION_BUS_ADDRESS
export XKL_XMODMAP_DISABLE=1

# Start XFCE session
exec startxfce4
EOF

chmod +x $VNC_HOME/.vnc/xstartup
echo "VNC startup script created"

# Start VNC server as user (not root)
echo "Starting VNC server..."
vncserver -depth 24 -geometry "1920x1080" -localhost no ":1"

sudo apt install pulseaudio pulseaudio-utils
systemctl --user enable pulseaudio
systemctl --user start pulseaudio

echo "VNC Server setup complete!"
echo "You can connect to VNC at: localhost:$VNC_PORT"
echo "To stop the server: vncserver -kill :1"

#!/bin/bash

# Add VNC auto-start to .bashrc
BASHRC_FILE="$HOME/.bashrc"
VNC_BLOCK='# Auto-start VNC server
if ! pgrep -f "Xvnc.*:1" > /dev/null; then
    vncserver -depth 24 -geometry "1920x1080" -localhost no ":1"
fi'

# Check if VNC block already exists
if grep -q "Xvnc.*:1" "$BASHRC_FILE" 2>/dev/null; then
    echo "VNC auto-start already exists in .bashrc"
    exit 0
fi

# Add VNC block to .bashrc
echo "" >> "$BASHRC_FILE"
echo "$VNC_BLOCK" >> "$BASHRC_FILE"

echo "Added VNC auto-start to .bashrc"
echo "VNC will start automatically when you SSH in"
