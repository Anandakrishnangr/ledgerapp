# Disk Cleanup Script for Android Development
# Run this script to free up disk space

Write-Host "Starting disk cleanup..." -ForegroundColor Green

# Clear temporary files
Write-Host "`nClearing temporary files..." -ForegroundColor Yellow
$tempDirs = @(
    "$env:TEMP",
    "$env:LOCALAPPDATA\Temp",
    "$env:WINDIR\Temp"
)

$freedSpace = 0
foreach ($dir in $tempDirs) {
    if (Test-Path $dir) {
        $size = (Get-ChildItem $dir -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
        if ($size -gt 0) {
            Remove-Item "$dir\*" -Recurse -Force -ErrorAction SilentlyContinue
            $freedSpace += $size
            Write-Host "Cleaned: $dir" -ForegroundColor Cyan
        }
    }
}

# Clear npm cache
Write-Host "`nClearing npm cache..." -ForegroundColor Yellow
npm cache clean --force 2>&1 | Out-Null

# Clear Expo cache
Write-Host "Clearing Expo cache..." -ForegroundColor Yellow
if (Test-Path "$env:USERPROFILE\.expo") {
    $expoSize = (Get-ChildItem "$env:USERPROFILE\.expo" -Recurse -ErrorAction SilentlyContinue | Measure-Object -Property Length -Sum).Sum
    Remove-Item "$env:USERPROFILE\.expo\*" -Recurse -Force -ErrorAction SilentlyContinue
    $freedSpace += $expoSize
}

# Show results
$freedGB = [math]::Round($freedSpace / 1GB, 2)
Write-Host "`nFreed up approximately: $freedGB GB" -ForegroundColor Green

# Show current free space
$drive = Get-PSDrive C
$freeGB = [math]::Round($drive.Free / 1GB, 2)
Write-Host "Current free space on C: $freeGB GB" -ForegroundColor $(if ($freeGB -lt 5) { "Red" } else { "Green" })

if ($freeGB -lt 5) {
    Write-Host "`n⚠️  WARNING: Still need more space! Consider:" -ForegroundColor Red
    Write-Host "  - Empty Recycle Bin" -ForegroundColor Yellow
    Write-Host "  - Uninstall unused programs" -ForegroundColor Yellow
    Write-Host "  - Move large files to external drive" -ForegroundColor Yellow
    Write-Host "  - Use Windows Disk Cleanup tool" -ForegroundColor Yellow
}





