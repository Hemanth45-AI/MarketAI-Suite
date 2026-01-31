# Git Configuration Script
# Run this script to configure Git with your information

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "  Git Configuration Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Get user input
$userName = Read-Host "Enter your name (e.g., John Doe)"
$userEmail = Read-Host "Enter your email (e.g., john@example.com)"

Write-Host ""
Write-Host "Configuring Git..." -ForegroundColor Yellow

# Configure Git
git config --global user.name "$userName"
git config --global user.email "$userEmail"

Write-Host ""
Write-Host "✅ Git configured successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Your Git configuration:" -ForegroundColor Cyan
git config --global user.name
git config --global user.email
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
