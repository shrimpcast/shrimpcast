#!/bin/bash

# Install UFW if not already installed
sudo apt install ufw

# Reset UFW to default settings
sudo ufw --force reset 

# Set default policies
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Define arrays for IPv4 and IPv6 subnets
ipv4_subnets=(
    173.245.48.0/20
    103.21.244.0/22
    103.22.200.0/22
    103.31.4.0/22
    141.101.64.0/18
    108.162.192.0/18
    190.93.240.0/20
    188.114.96.0/20
    197.234.240.0/22
    198.41.128.0/17
    162.158.0.0/15
    104.16.0.0/13
    104.24.0.0/14
    172.64.0.0/13
    131.0.72.0/22
)

ipv6_subnets=(
    2400:cb00::/32
    2606:4700::/32
    2803:f800::/32
    2405:b500::/32
    2405:8100::/32
    2a06:98c0::/29
    2c0f:f248::/32
)

# Allow incoming TCP traffic on ports 80, 443 from specified IPv4 and IPv6 subnets
for subnet in "${ipv4_subnets[@]}" "${ipv6_subnets[@]}"; do
    sudo ufw allow proto tcp from "$subnet" to any port 80,443
done


# Allow specific TCP traffic
for subnet in "${ipv4_subnets[@]}" "${ipv6_subnets[@]}"; do
    sudo ufw route allow proto tcp from "$subnet" to any port 2053,2443
done

# Allow specific TCP traffic
sudo ufw allow OpenSSH
sudo ufw allow 1935
sudo ufw route allow proto tcp from any to any port 1935

# Enable UFW with the configured rules
sudo ufw --force enable

# Define the rules to be added
RULES="
# BEGIN UFW AND DOCKER
*filter
:ufw-user-forward - [0:0]
:DOCKER-USER - [0:0]
-A DOCKER-USER -j RETURN -s 10.0.0.0/8
-A DOCKER-USER -j RETURN -s 172.16.0.0/12
-A DOCKER-USER -j RETURN -s 192.168.0.0/16

-A DOCKER-USER -j ufw-user-forward

-A DOCKER-USER -j DROP -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 192.168.0.0/16
-A DOCKER-USER -j DROP -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 10.0.0.0/8
-A DOCKER-USER -j DROP -p tcp -m tcp --tcp-flags FIN,SYN,RST,ACK SYN -d 172.16.0.0/12
-A DOCKER-USER -j DROP -p udp -m udp --dport 0:32767 -d 192.168.0.0/16
-A DOCKER-USER -j DROP -p udp -m udp --dport 0:32767 -d 10.0.0.0/8
-A DOCKER-USER -j DROP -p udp -m udp --dport 0:32767 -d 172.16.0.0/12

-A DOCKER-USER -j RETURN
COMMIT
# END UFW AND DOCKER
"

# Add rules to /etc/ufw/after.rules
echo "$RULES" | sudo tee -a /etc/ufw/after.rules

# Restart ufw
sudo systemctl restart ufw

# Define the file path
nginx_config_file="/etc/nginx/sites-available/default"

sed -i 's/\$proxy_add_x_forwarded_for/\$http_cf_connecting_ip/g' "$nginx_config_file"
nginx -t
systemctl reload nginx

echo "Cloudflare setup completed successfully."
