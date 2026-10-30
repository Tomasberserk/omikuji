# Builds the app and publishes dist/ to the gh-pages branch (GitHub Pages).
# Usage: npm run deploy
param(
  [string]$Message = "Deploy dist"
)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

Write-Host "Building..." -ForegroundColor Cyan
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed" }

$dist = Join-Path $root 'dist'
if (-not (Test-Path (Join-Path $dist 'index.html'))) { throw "dist/index.html not found" }

$tmp = Join-Path $env:TEMP 'omikuji-gh-pages'
if (Test-Path $tmp) { Remove-Item -Recurse -Force $tmp }
New-Item -ItemType Directory -Path $tmp | Out-Null
Copy-Item (Join-Path $dist '*') $tmp -Recurse -Force
Copy-Item (Join-Path $dist '.nojekyll') $tmp -Force

Push-Location $tmp
try {
  git init -b gh-pages | Out-Null
  git add -A
  git commit --allow-empty -m $Message | Out-Null
  git remote add origin (git -C $root remote get-url origin)
  git push -f origin gh-pages
  if ($LASTEXITCODE -ne 0) { throw "git push failed" }
}
finally {
  Pop-Location
}

Write-Host "Deployed: https://tomasberserk.github.io/omikuji/" -ForegroundColor Green
