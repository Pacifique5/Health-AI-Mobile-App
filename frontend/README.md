# SymptomAI Mobile - Frontend

React Native mobile application for SymptomAI health assistant.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on device/emulator:
```bash
npm run android  # For Android
npm run ios      # For iOS
```

## Project Structure

```
frontend/
├── src/
│   ├── screens/          # App screens
│   │   ├── LoginScreen.js
│   │   ├── SignupScreen.js
│   │   ├── DashboardScreen.js
│   │   ├── SymptomCheckerScreen.js
│   │   └── ResultsScreen.js
│   ├── components/       # Reusable components
│   │   ├── Input.js
│   │   └── GradientButton.js
│   ├── context/          # React Context
│   │   └── AuthContext.js
│   └── config/           # Configuration
│       └── api.js        # API integration
├── App.js               # Main app component
├── app.json            # Expo configuration
└── package.json        # Dependencies

```

## Features

- User authentication (login/signup)
- Symptom analysis with AI
- Beautiful gradient UI
- Secure session management
- Error handling

## API Configuration

Update the API URL in `src/config/api.js`:
```javascript
const API_URL = 'http://localhost:5000'; // Change for production
```

## Test Accounts

- Email: `admin@example.com`, Password: `admin123`
- Email: `user@example.com`, Password: `user123`
