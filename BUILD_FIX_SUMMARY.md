# Build Issue Summary & Solutions

## Problem
The build fails with minSdkVersion mismatch errors when building for `arm64-v8a` architecture. The error says "User has minSdkVersion 22 but library was built for 24".

## What We Fixed
1. ✅ Set `minSdkVersion` to 24 in `android/app/build.gradle`
2. ✅ Changed `reactNativeArchitectures` to `x86_64` only in `gradle.properties`
3. ✅ Cleared all build caches

## Remaining Issue
Expo CLI is passing `-PreactNativeArchitectures=x86_64,arm64-v8a` on the command line, which overrides the gradle.properties setting. This causes the build to still attempt building for `arm64-v8a`, which fails.

## Recommended Solutions

### Option 1: Use Expo Go (Easiest for Development) ⭐ RECOMMENDED
No build needed - just run the dev server:
```bash
npm start
# Then scan QR code with Expo Go app on your phone
# Or press 'a' if emulator is running
```

### Option 2: Use EAS Build (Cloud Build) ⭐ BEST FOR APK
Build in the cloud - no local issues:
```bash
npm install -g eas-cli
eas login
eas build --platform android --profile preview
```

### Option 3: Build Only for Emulator (x86_64)
If you must build locally, you can try:
```bash
cd android
.\gradlew.bat app:assembleDebug -PreactNativeArchitectures=x86_64
```

Then install manually:
```bash
adb install app\build\outputs\apk\debug\app-debug.apk
```

### Option 4: Use Physical Device
Connect your Android phone via USB:
1. Enable USB debugging on phone
2. Connect via USB
3. Run: `npm run android`

The build will only target the connected device's architecture.

## Current Configuration
- ✅ minSdkVersion: 24
- ✅ Architecture in gradle.properties: x86_64 only
- ⚠️ Expo CLI still passes arm64-v8a on command line

## Recommendation
For development: **Use Expo Go** (Option 1)
For production APK: **Use EAS Build** (Option 2)





