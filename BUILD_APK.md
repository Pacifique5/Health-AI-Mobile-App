# 📱 SymptomAI APK Build Guide

## 🚀 Quick Start Commands

### 1. Install EAS CLI
```bash
npm install -g @expo/eas-cli
```

### 2. Login to Expo
```bash
eas login
```

### 3. Configure Project (First time only)
```bash
cd frontend
eas build:configure
```

### 4. Build APK
```bash
# For sharing/testing (recommended)
eas build --platform android --profile preview

# For production
eas build --platform android --profile production
```

### 5. Check Build Status
```bash
eas build:list
```

## 📋 Build Profiles

- **preview**: Creates APK file for easy sharing and testing
- **production**: Optimized build for app stores
- **development**: Development build with debugging enabled

## 🔗 Download Links

After build completes, you'll get:
- Direct download link in terminal
- Download from Expo dashboard: https://expo.dev/
- APK file for GitHub releases

## 📦 Current Configuration

- **App Name**: SymptomAI
- **Package**: com.fique.symptomai
- **Version**: 1.0.0
- **Build Type**: APK (Android Package)

## 🎯 For GitHub Release

1. Build APK: `eas build --platform android --profile preview`
2. Download APK from provided link
3. Go to GitHub repo → Releases → Create new release
4. Upload APK file
5. Tag as `v1.0.0`
6. Publish release

## 🔧 Troubleshooting

If build fails:
1. Check `eas build:list` for error details
2. Ensure all dependencies are installed
3. Verify app.json configuration
4. Check Expo dashboard for detailed logs

## 📱 Testing APK

1. Download APK to Android device
2. Enable "Install from unknown sources"
3. Install APK file
4. Test all features

---
**Ready to build?** Run: `eas build --platform android --profile preview`