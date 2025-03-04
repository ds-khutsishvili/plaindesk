@echo off
echo Stopping any running processes...
taskkill /f /im node.exe

echo Clearing node_modules cache...
rmdir /s /q node_modules\.cache 2>nul
cd board && rmdir /s /q node_modules\.cache 2>nul
cd ..\widget && rmdir /s /q node_modules\.cache 2>nul
cd ..

echo Starting applications...
npm start 