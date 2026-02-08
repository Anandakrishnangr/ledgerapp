# System Requirements Check

## Issues Found

### ❌ CRITICAL: Not Enough Disk Space
**Error:** `Not enough disk space to run AVD 'Medium_Phone_API_35'`

**Current Status:**
- **C: Drive Free Space: 1.76 GB** ⚠️ CRITICALLY LOW
- **C: Drive Used: 270.92 GB**

The Android emulator requires significant disk space. Your AVD needs:
- System image: ~2-3 GB
- User data partition: 2 GB (reduced from 6.4 GB)
- Cache and temporary files: ~1-2 GB
- **Total required: ~5-7 GB free space minimum**
- **You currently have: 1.76 GB** ❌

### ⚠️ Java Version
- **Current:** Java 21.0.7
- **Recommended:** Java 17 (LTS) for Android development
- Java 21 may work but Java 17 is more stable with Android toolchain

### ✅ Working Components
- ✅ Android SDK installed at: `C:\Users\grana\AppData\Local\Android\Sdk`
- ✅ Android Emulator found: Version 35.2.10.0
- ✅ WHPX (Windows Hypervisor Platform) enabled and working
- ✅ ANDROID_HOME environment variable set correctly
- ✅ AVD configured: Medium_Phone_API_35 (2GB RAM)
- ✅ ADB (Android Debug Bridge) installed

## Solutions

### 1. Free Up Disk Space (URGENT - Required)
**You need to free up at least 5-10 GB immediately:**

**Run the automated cleanup script:**
```powershell
cd ledgerx365
.\cleanup-disk.ps1
```

Or manually:
```powershell
# Clear Windows temporary files
Remove-Item "$env:TEMP\*" -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item "$env:LOCALAPPDATA\Temp\*" -Recurse -Force -ErrorAction SilentlyContinue

# Clear Windows Update cache (run as Administrator)
# dism.exe /online /cleanup-image /startcomponentcleanup

# Clear browser cache
# Chrome: Settings > Privacy > Clear browsing data
# Edge: Settings > Privacy > Clear browsing data
```

Other options:
- Empty Recycle Bin
- Delete large unused files/videos
- Uninstall unused programs (check Programs and Features)
- Move large files to external drive
- Use Windows Disk Cleanup tool
- **Target: At least 10 GB free space on C: drive**

### 2. Reduce AVD Disk Size
Edit the AVD configuration to use less disk space:
- Location: `C:\Users\grana\.android\avd\Medium_Phone.avd\config.ini`
- Change `disk.dataPartition.size` from 6442450944 (6GB) to 2147483648 (2GB)

### 3. Use Physical Device Instead
Connect an Android phone via USB and enable USB debugging:
```bash
# Check if device is connected
adb devices
```

### 4. Use Expo Go App (Easiest for Development)
Instead of building native app, use Expo Go:
```bash
npm start
# Then scan QR code with Expo Go app on your phone
```

### 5. Set JAVA_HOME (Optional but Recommended)
```powershell
# Set JAVA_HOME to Java 17 if you install it
# Or use current Java 21 location:
$env:JAVA_HOME = "C:\Program Files\Common Files\Oracle\Java"
[System.Environment]::SetEnvironmentVariable('JAVA_HOME', $env:JAVA_HOME, 'User')
```

## Recommended: Use EAS Build (Cloud Build)
Build APK in the cloud to avoid local issues:
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

## Quick Fix Applied
✅ Reduced AVD disk size from 6GB to 2GB to free up space.
Try running the emulator again:
```bash
npm run android
```

If it still fails, you need to free up more disk space on your C: drive.

