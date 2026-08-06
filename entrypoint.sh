#!/bin/sh
set -e

echo "Running Payload migrations..."
node ./node_modules/.bin/payload migrate

echo "Starting Next.js server..."
exec node server.js