#!/bin/bash
set -e

echo "Starting build process..."
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"

cd client

echo "Installing dependencies..."
npm install --verbose

echo "Building application..."
npm run build

echo "Build completed successfully!"
ls -la dist/
