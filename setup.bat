@echo off
echo Installing dependencies...
npm install
cd board && npm install
cd ../widget && npm install
cd ..

echo Starting applications...
npm start 