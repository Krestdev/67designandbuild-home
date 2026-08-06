#!/bin/sh
set -e

echo "Running Payload migrations..."
node npm run payload migrate

echo "Starting Next.js server..."
exec node server.js