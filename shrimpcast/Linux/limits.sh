# Set desired file descriptor limit
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

echo "Rebooting to apply system wide changes"
reboot