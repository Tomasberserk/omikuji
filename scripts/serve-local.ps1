# Serves dist/ on the local network as an offline fallback for the stand.
# Usage: npm run stand
param(
  [int]$Port = 4173
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path (Join-Path $root 'dist\index.html'))) {
  Write-Host "Building..." -ForegroundColor Cyan
  npm run build
  if ($LASTEXITCODE -ne 0) { throw "Build failed" }
}

$ip = (Get-NetIPConfiguration -ErrorAction SilentlyContinue |
    Where-Object { $_.IPv4DefaultGateway -and $_.NetAdapter.Status -eq 'Up' } |
    Select-Object -First 1).IPv4Address.IPAddress

if (-not $ip) {
  $ip = Get-NetIPAddress -AddressFamily IPv4 -ErrorAction SilentlyContinue |
    Where-Object { $_.IPAddress -notlike '127.*' -and $_.IPAddress -notlike '169.254.*' } |
    Sort-Object InterfaceMetric |
    Select-Object -First 1 -ExpandProperty IPAddress
}

if (-not $ip) { $ip = 'localhost' }
$url = "http://${ip}:$Port/"

Write-Host ""
Write-Host "Omikuji - local stand server" -ForegroundColor Green
Write-Host "URL: $url" -ForegroundColor Green
Write-Host "Phones must be on the same wifi, or on this laptop's hotspot." -ForegroundColor Yellow
Write-Host ""

try {
  npx -y qrcode -o "qr/qr-local.png" -w 1200 -e H -d 2A1A15ff -l ffffffff $url 2>$null
  if ($LASTEXITCODE -eq 0) {
    Write-Host "Local QR saved to qr\qr-local.png" -ForegroundColor Green
  }
}
catch {
  Write-Host "Could not create the local QR. Use the URL above." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting server... (Ctrl+C to stop)" -ForegroundColor Cyan
npx vite preview --host --port $Port
