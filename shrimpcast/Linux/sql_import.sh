#!/bin/bash

# Variables
DB_NAME="shrimpcast"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"
SQL_FILE_URL=""
SQL_FILE_NAME="data.sql"
export PGPASSWORD='$hrimpca$t'

# Drop database 'shrimpcast' and terminate connections
dropdb -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -f "$DB_NAME"

# Download SQL file
wget -O "$SQL_FILE_NAME" "$SQL_FILE_URL"

# Create database 'shrimpcast'
createdb -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" "$DB_NAME"

# Import SQL file into PostgreSQL
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "$SQL_FILE_NAME"

# Clean up downloaded SQL file
rm "$SQL_FILE_NAME"

# Restart shrimpcast service
sudo systemctl restart shrimpcast
