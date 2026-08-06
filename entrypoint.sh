#!/bin/sh
set -e

echo "Running Payload migrations..."
exec npm run payload migrate


echo "Starting Next.js server..."
exec node server.js