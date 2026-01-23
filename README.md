# 🤖 SymptomAI - AI-Powered Health Assistant

[![Build APK](https://github.com/yourusername/symptom-ai/actions/workflows/build-apk.yml/badge.svg)](https://github.com/yourusername/symptom-ai/actions/workflows/build-apk.yml)
[![Latest Release](https://img.shields.io/github/v/release/yourusername/symptom-ai?include_prereleases)](https://github.com/yourusername/symptom-ai/releases/latest)
[![Downloads](https://img.shields.io/github/downloads/yourusername/symptom-ai/total)](https://github.com/yourusername/symptom-ai/releases)

<div align="center">

## 📱 **Download SymptomAI APK**

[![Download APK](https://img.shields.io/badge/Download-APK%20v1.0.0-brightgreen?style=for-the-badge&logo=android)](https://github.com/yourusername/symptom-ai/releases/latest/download/SymptomAI-v1.0.0.apk)

**Latest Version**: v1.0.0 | **Size**: ~25MB | **Android 7.0+**

[📥 **Direct Download**](https://expo.dev/artifacts/eas/6oehZZrwHU7Zq4dJmzQWpS.apk) | [📋 **All Releases**](https://github.com/yourusername/symptom-ai/releases) | [🐛 **Report Issues**](https://github.com/yourusername/symptom-ai/issues)

</div>

---

A comprehensive mobile health application that uses AI to analyze symptoms and provide health insights. Built with React Native (Expo) frontend and NestJS backend.

## 🎯 **Quick Start**

### **For Users (APK Installation)**
1. **Download APK** from the button above
2. **Enable "Install from unknown sources"** in Android settings
3. **Install the APK** file on your device
4. **Open SymptomAI** and start using the AI health assistant

### **For Developers**
```bash
# Clone repository
git clone https://github.com/yourusername/symptom-ai.git
cd symptom-ai

# Setup backend
cd backend && npm install && npm run start:dev

# Setup frontend  
cd frontend && npm install && npm start
```

## ✨ Features

### 🔍 **AI Symptom Analysis**
- Analyze symptoms using real medical data
- Get disease predictions with confidence scores
- Receive treatment recommendations and precautions
- Minimum 3 symptoms required for accurate analysis

### 💬 **Intelligent Chat Interface**
- Natural conversation with AI health assistant
- Greeting detection and contextual responses
- Conversation history and management
- Real-time typing indicators

### 👤 **User Management**
- Secure user authentication with JWT
- Profile management with picture upload
- Password and email change functionality
- Persistent login sessions

### 🎨 **Modern UI/UX**
- Dark/Light mode toggle
- Gradient designs and smooth animations
- Responsive layout for all screen sizes
- Intuitive navigation and controls

### 🔔 **Smart Notifications**
- Customizable notification preferences
- Health reminders and updates
- Medication and appointment alerts
- System notifications

### 📚 **Help & Support**
- Comprehensive FAQ section (25+ questions)
- Emergency contacts integration
- Settings and preferences management
- Contact support options

## 🏗️ Architecture

### Frontend (React Native + Expo)
```
frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens
│   ├── context/        # React contexts (Auth, Theme, Notifications)
│   └── config/         # API configuration
├── assets/             # App icons and images
└── App.js             # Main app entry point
```

### Backend (NestJS + TypeORM)
```
backend/
├── src/
│   ├── auth/          # Authentication module
│   ├── conversations/ # Chat management
│   ├── symptom/       # AI symptom analysis
│   ├── entities/      # Database entities
│   └── data/          # Medical datasets (CSV files)
└── uploads/           # File uploads (profile pictures)
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Android device or emulator
- Expo CLI

### 1. Clone Repository
```bash
git clone https://github.com/yourusername/symptom-ai.git
cd symptom-ai
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run start:dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm start
```

### 4. Run on Device
- Install Expo Go app on your Android device
- Scan QR code from terminal
- Or use Android emulator

## 📦 Build APK

### Quick Build
```bash
cd frontend
npm run build:apk
```

### Manual Build
```bash
# Install EAS CLI
npm install -g @expo/eas-cli

# Login to Expo
eas login

# Configure build (first time)
eas build:configure

# Build APK
eas build --platform android --profile preview
```

See [BUILD_APK.md](frontend/BUILD_APK.md) for detailed instructions.

## 🗄️ Database & Data

### Medical Datasets
The app uses real medical data from CSV files:
- `DiseaseAndSymptoms.csv` - Disease-symptom mappings
- `symptom_Description.csv` - Symptom descriptions
- `disease_treatments.csv` - Treatment recommendations
- `Disease precaution.csv` - Prevention measures
- `Symptom-severity.csv` - Symptom severity weights
- `greetings.csv` - Greeting patterns

### Database Schema
- **Users**: Authentication and profile data
- **Conversations**: Chat history management
- **Messages**: Individual chat messages
- SQLite database with TypeORM

## 🔧 Configuration

### Backend Environment (.env)
```env
PORT=5000
JWT_SECRET=your-jwt-secret
DATABASE_URL=./database.sqlite
```

### Frontend API Configuration
```javascript
// src/config/api.js
const API_BASE_URL = 'http://YOUR_IP:5000';
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Testing
```bash
cd frontend
npm run test
```

## 📱 App Screenshots

| Dashboard | Symptom Analysis | Settings |
|-----------|------------------|----------|
| ![Dashboard](screenshots/dashboard.png) | ![Analysis](screenshots/analysis.png) | ![Settings](screenshots/settings.png) |

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Medical data sourced from open healthcare datasets
- Icons and illustrations from various open-source projects
- Built with React Native, Expo, and NestJS

## 📞 Support

- 📧 Email: support@symptomai.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/symptom-ai/issues)
- 📖 Documentation: [Wiki](https://github.com/yourusername/symptom-ai/wiki)

---

**Made with ❤️ by Fique's AI Team**