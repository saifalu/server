#!/bin/bash

cd ~/app

echo "Installing dependencies..."
npm install

echo "Stopping old server..."
pkill -f "node server.js" || true

echo "Starting server.js in background..."
nohup node server.js > server.log 2>&1 &

