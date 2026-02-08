# Build APK

## Build using Expo Cloud (EAS Build) - Recommended

1. Install EAS CLI (if not already installed):
```bash
npm install -g eas-cli
```

2. Login to Expo:
```bash
eas login
```

3. Build APK in the cloud:
```bash
eas build --platform android --profile preview
```

For production build:
```bash
eas build --platform android --profile production
```

The APK will be available for download from the Expo dashboard after the build completes.

## Local Build (Alternative)

```bash
npx expo prebuild --clean
npx expo run:android --variant release
```

The APK will be located at:
`android/app/build/outputs/apk/release/app-release.apk`

## If local build gets stuck

1. Stop the build (Ctrl+C)
2. Clean Gradle cache:
```bash
cd android
./gradlew clean
cd ..
```

3. Try building again:
```bash
npx expo run:android --variant release
```

## Alternative: Build APK directly with Gradle

```bash
cd android
./gradlew assembleRelease
```

APK location: `app/build/outputs/apk/release/app-release.apk`
