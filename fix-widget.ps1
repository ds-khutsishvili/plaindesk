Write-Host "Stopping any running processes..." -ForegroundColor Cyan
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

Write-Host "Clearing node_modules cache..." -ForegroundColor Cyan
if (Test-Path "node_modules\.cache") {
    Remove-Item -Path "node_modules\.cache" -Recurse -Force
}
if (Test-Path "board\node_modules\.cache") {
    Remove-Item -Path "board\node_modules\.cache" -Recurse -Force
}
if (Test-Path "widget\node_modules\.cache") {
    Remove-Item -Path "widget\node_modules\.cache" -Recurse -Force
}

Write-Host "Starting applications..." -ForegroundColor Green
npm start 