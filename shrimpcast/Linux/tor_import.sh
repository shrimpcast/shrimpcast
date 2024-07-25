#!/bin/sh

# Variables
DB_NAME="shrimpcast"
DB_USER="postgres"
DB_HOST="localhost"
DB_PORT="5432"
TOR_EXIT_NODES_URL="https://www.dan.me.uk/torlist/?exit"
export PGPASSWORD='$hrimpca$t'

# Download the file and pass its contents directly to psql using process substitution
psql -U "$DB_USER" -h "$DB_HOST" -p "$DB_PORT" -d "$DB_NAME" -c "
    DELETE FROM public.\"TorExitNode\";
    CREATE TEMP TABLE temp_tor_exit_nodes (
        ip_address TEXT
    );
    COPY temp_tor_exit_nodes (ip_address) FROM PROGRAM 'curl -sS $TOR_EXIT_NODES_URL';
    INSERT INTO public.\"TorExitNode\" (\"RemoteAddress\")
    SELECT ip_address FROM temp_tor_exit_nodes;
"
