#!/bin/bash
# Build script for Vercel

echo "Starting Vercel build..."

# Build the client with Vite
echo "Building client..."
npx vite build

# Build the server
echo "Building server..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist

echo "Build complete!"