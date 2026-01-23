#!/usr/bin/env node

/**
 * Automated GitHub Release Creator for SymptomAI
 * Usage: node scripts/create-release.js
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 SymptomAI GitHub Release Creator');
console.log('===================================\n');

// Read package.json for version
const packagePath = path.join(__dirname, '../frontend/package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const version = packageJson.version;

console.log(`📦 Version: ${version}`);
console.log(`📱 APK URL: https://expo.dev/artifacts/eas/6oehZZrwHU7Zq4dJmzQWpS.apk\n`);

// Generate release notes
const releaseNotes = `# 🚀 SymptomAI v${version} - Android APK Release

## 📱 Download APK
**File**: \`SymptomAI-v${version}.apk\`  
**Size**: ~25MB  
**Android**: 7.0+ (API 24+)

## ✨ What's New in v${version}

### 🔥 **Core Features**
- ✅ **AI Symptom Analysis** - Analyze symptoms using real medical data
- ✅ **Smart Chat Interface** - Natural conversation with health assistant  
- ✅ **User Authentication** - Secure login with profile management
- ✅ **Dark/Light Mode** - Toggle between themes instantly
- ✅ **Conversation History** - Save and manage chat sessions
- ✅ **Profile Management** - Upload pictures, change credentials

### 🎨 **UI/UX Improvements**
- ✅ Modern gradient designs and smooth animations
- ✅ Responsive layout for all screen sizes
- ✅ Intuitive sidebar navigation
- ✅ Enhanced dropdown menus and controls

### 🔔 **Smart Features**
- ✅ Customizable notifications
- ✅ Emergency contacts integration
- ✅ Comprehensive FAQ section (25+ questions)
- ✅ Settings and preferences management

### 🧠 **AI & Data**
- ✅ Real medical datasets (CSV-based)
- ✅ Disease-symptom mapping with confidence scores
- ✅ Treatment recommendations and precautions
- ✅ Greeting detection and contextual responses

## 📋 **Installation Instructions**

### **Android Installation**
1. **Download** the APK file from this release
2. **Enable "Install from unknown sources"**:
   - Go to Settings → Security → Unknown Sources
   - Or Settings → Apps → Special Access → Install Unknown Apps
3. **Install** the APK file
4. **Open** SymptomAI and enjoy!

### **System Requirements**
- **Android**: 7.0+ (API level 24+)
- **RAM**: 2GB+ recommended
- **Storage**: 100MB free space
- **Internet**: Required for AI analysis

## 🔧 **Technical Details**

### **Backend API**
- **Framework**: NestJS + TypeORM
- **Database**: SQLite with medical datasets
- **Authentication**: JWT tokens
- **File Upload**: Profile pictures support

### **Frontend App**
- **Framework**: React Native + Expo
- **Navigation**: React Navigation v7
- **State Management**: React Context
- **UI Components**: Custom gradient components

### **Build Information**
- **Build Profile**: Preview (optimized for sharing)
- **SDK Version**: Expo 54.0.0
- **Build Time**: ~11 minutes
- **Bundle Size**: ~25MB

## 🐛 **Known Issues**
- None reported for this version

## 🔄 **Changelog**
- Initial release with all core features
- AI symptom analysis with real medical data
- Complete user authentication system
- Modern UI with dark/light mode support

## 📞 **Support**
- 🐛 **Report Issues**: [GitHub Issues](https://github.com/yourusername/symptom-ai/issues)
- 📧 **Email**: support@symptomai.com
- 📖 **Documentation**: [Project Wiki](https://github.com/yourusername/symptom-ai/wiki)

## 🙏 **Credits**
Built with ❤️ by **Fique's AI Team**

---

**Enjoy using SymptomAI! 🎯📱**`;

// Write release notes to file
const releaseNotesPath = path.join(__dirname, '../RELEASE_NOTES.md');
fs.writeFileSync(releaseNotesPath, releaseNotes);

console.log('✅ Release notes generated: RELEASE_NOTES.md');

// Generate GitHub CLI commands
const commands = `
# GitHub CLI Commands to Create Release

# 1. Create release with notes
gh release create v${version} \\
  --title "SymptomAI v${version} - Android APK Release" \\
  --notes-file RELEASE_NOTES.md \\
  --latest

# 2. Upload APK (after downloading and renaming)
gh release upload v${version} SymptomAI-v${version}.apk

# 3. View release
gh release view v${version} --web
`;

console.log('\n📋 GitHub CLI Commands:');
console.log(commands);

// Generate manual steps
const manualSteps = `
📋 Manual GitHub Release Steps:

1. 📥 Download APK:
   https://expo.dev/artifacts/eas/6oehZZrwHU7Zq4dJmzQWpS.apk
   
2. 📝 Rename to: SymptomAI-v${version}.apk

3. 🌐 Go to GitHub → Releases → Create new release

4. 🏷️ Tag: v${version}
   Title: SymptomAI v${version} - Android APK Release

5. 📄 Copy release notes from: RELEASE_NOTES.md

6. 📎 Upload: SymptomAI-v${version}.apk

7. ✅ Check "Set as latest release"

8. 🚀 Publish release
`;

console.log(manualSteps);

console.log('\n🎯 Next Steps:');
console.log('1. Download APK from Expo link above');
console.log('2. Rename APK file');
console.log('3. Create GitHub release (manual or CLI)');
console.log('4. Upload APK to release');
console.log('5. Update README.md with your GitHub username');
console.log('\n✨ Your SymptomAI will be ready for download! 🚀');