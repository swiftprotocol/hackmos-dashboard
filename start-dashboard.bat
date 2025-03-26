@echo off
echo Starting Dashboard...

echo Checking if next is installed...
where next >nul 2>nul
if %errorlevel% neq 0 (
  echo Next.js not found. Installing necessary dependencies...
  call npm install --legacy-peer-deps
  if %errorlevel% neq 0 (
    echo Error installing dependencies. Please run fix-setup.bat
    pause
    exit /b 1
  )
)

echo Starting the development server...
npx next dev --turbopack

if %errorlevel% neq 0 (
  echo Error starting the server. Please run fix-setup.bat to fix installation issues.
  pause
) 