@echo off
echo.
echo =====================================
echo   Newsletter Automation Setup
echo =====================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/5] Checking Node.js version...
node --version
echo.

echo [2/5] Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ERROR: Failed to install dependencies
    pause
    exit /b 1
)
echo.

echo [3/5] Creating configuration file...
if not exist .env (
    copy .env.example .env
    echo Created .env file
    echo IMPORTANT: Edit .env and add your API keys!
) else (
    echo .env already exists, skipping...
)
echo.

echo [4/5] Creating directories...
if not exist drafts mkdir drafts
if not exist logs mkdir logs
echo Directories created
echo.

echo [5/5] Running setup verification...
call npm test
echo.

echo =====================================
echo   Setup Complete!
echo =====================================
echo.
echo Next steps:
echo 1. Edit .env and add your API keys
echo    - Anthropic API key from https://console.anthropic.com/
echo    - Brave Search API key from https://brave.com/search/api/
echo.
echo 2. Set up Gmail authentication:
echo    npm run auth
echo.
echo 3. Generate your first newsletter:
echo    npm run generate
echo.
echo For detailed instructions, see GETTING_STARTED.md
echo.
pause
