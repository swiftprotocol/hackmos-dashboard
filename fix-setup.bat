@echo off
echo Fixing Next.js installation...

echo Installing Next.js globally...
call npm install -g next

echo Reinstalling dependencies with legacy peer deps...
call npm install --legacy-peer-deps

echo Setup complete! You can now run the dashboard with: 
echo .\start-dashboard.bat
pause 