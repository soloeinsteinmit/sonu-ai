# PowerShell script to create PWA icons using ImageMagick
# Run this script if you have ImageMagick installed: https://imagemagick.org/

$inputIcon = "..\public\icons\icon-192x192.png"
$outputDir = "..\public\icons"

if (-not (Test-Path $inputIcon)) {
    Write-Host "Error: Input file $inputIcon not found" -ForegroundColor Red
    Write-Host "Please ensure you have an icon-192x192.png file in public/icons/" -ForegroundColor Yellow
    exit 1
}

# Check if ImageMagick is installed
if (-not (Get-Command magick -ErrorAction SilentlyContinue)) {
    Write-Host "Error: ImageMagick is not installed" -ForegroundColor Red
    Write-Host "Please install ImageMagick from https://imagemagick.org/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Generating PWA icons..." -ForegroundColor Green

# Create standard icons
magick $inputIcon -resize 192x192 "$outputDir\icon-192x192.png"
magick $inputIcon -resize 512x512 "$outputDir\icon-512x512.png"

# Create maskable icons with padding
magick $inputIcon -resize 160x160 -background "#16a34a" -gravity center -extent 192x192 "$outputDir\maskable-192x192.png"
magick $inputIcon -resize 420x420 -background "#16a34a" -gravity center -extent 512x512 "$outputDir\maskable-512x512.png"

Write-Host "PWA icon generation complete!" -ForegroundColor Green
Write-Host "Files generated:" -ForegroundColor Green
Write-Host "- icon-192x192.png" -ForegroundColor Cyan
Write-Host "- icon-512x512.png" -ForegroundColor Cyan
Write-Host "- maskable-192x192.png" -ForegroundColor Cyan
Write-Host "- maskable-512x512.png" -ForegroundColor Cyan