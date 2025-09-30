#!/bin/bash

echo ""
echo "====================================="
echo "  Newsletter Automation Setup"
echo "====================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[1/5] Checking Node.js version..."
node --version
echo ""

echo "[2/5] Installing dependencies..."
npm install
if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies"
    exit 1
fi
echo ""

echo "[3/5] Creating configuration file..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo "Created .env file"
    echo "IMPORTANT: Edit .env and add your API keys!"
else
    echo ".env already exists, skipping..."
fi
echo ""

echo "[4/5] Creating directories..."
mkdir -p drafts logs
echo "Directories created"
echo ""

echo "[5/5] Running setup verification..."
npm test
echo ""

echo "====================================="
echo "  Setup Complete!"
echo "====================================="
echo ""
echo "Next steps:"
echo "1. Edit .env and add your API keys"
echo "   - Anthropic API key from https://console.anthropic.com/"
echo "   - Brave Search API key from https://brave.com/search/api/"
echo ""
echo "2. Set up Gmail authentication:"
echo "   npm run auth"
echo ""
echo "3. Generate your first newsletter:"
echo "   npm run generate"
echo ""
echo "For detailed instructions, see GETTING_STARTED.md"
echo ""
