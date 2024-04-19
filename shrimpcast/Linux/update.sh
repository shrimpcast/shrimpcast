#!/bin/bash

# Define the URL and destination folder
DEST_FOLDER=~/shrimpcast
URL=""
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

# Function to download and extract the ZIP file
download_and_extract() {
    # Delete existing contents in the destination folder
    if [ -d "$DEST_FOLDER" ]; then
        rm -rf "$DEST_FOLDER"/*
    else
        mkdir -p "$DEST_FOLDER"
    fi

    # Download the ZIP file
    curl -L "$URL" -o "$DEST_FOLDER/shrimpcast.zip"

    # Extract the contents of the ZIP file
    unzip -q "$DEST_FOLDER/shrimpcast.zip" -d "$DEST_FOLDER"

    # Remove the downloaded ZIP file
    rm "$DEST_FOLDER/shrimpcast.zip"

    #Adjust appsettings.json
    sed -i "s/{0}/$DOMAIN/g" /root/shrimpcast/wwwroot/manifest.json
}

# Function to restart the shrimpcast service
restart_shrimpcast() {
    # Change permissions of shrimpcast
    chmod +x "$DEST_FOLDER/shrimpcast"
    
    # Restart shrimpcast service
    sudo systemctl restart shrimpcast
}

# Execute the download and extract function
download_and_extract

# Restart the shrimpcast service
restart_shrimpcast

echo "Files extracted successfully to $DEST_FOLDER folder."
echo "shrimpcast service restarted."

