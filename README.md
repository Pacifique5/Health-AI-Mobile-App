# SymptomAI Mobile Application

AI-powered health assistant mobile app built with React Native and Flask.

## Project Structure

```
symptom-ai-mobile/
├── frontend/              # React Native mobile app
│   ├── src/
│   │   ├── screens/      # App screens
│   │   ├── components/   # Reusable components
│   │   ├── context/      # State management
│   │   └── config/       # API configuration
│   ├── App.js
│   └── package.json
│
├── backend/              # Flask REST API
│   ├── api_server.py
│   ├── start_server.py
│   └── requirements.txt
│
└── README.md
```

## Quick Start

### Backend Setup

1. Navigate to backend folder:
```bash
cd backend
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the Flask server:
```bash
python start_server.py
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend folder:
```bash
cd frontend
```

2. Install Node dependencies:
```bash
npm install
```

3. Start Expo development server:
```bash
npm start
```

4. Run on device:
```bash
npm run android  # For Android
npm run ios      # For iOS
```

## Features

- 🔐 User authentication (login/signup)
- 🔍 AI-powered symptom analysis
- 📊 Disease prediction with recommendations
- 💊 Medication and treatment suggestions
- 👨‍⚕️ Specialist recommendations
- 🎨 Beautiful gradient UI
- 📱 Cross-platform (iOS & Android)

## Tech Stack

### Frontend
- React Native (Expo)
- React Navigation
- Axios
- AsyncStorage
- Linear Gradient

### Backend
- Flask
- Flask-CORS
- Pandas
- RapidFuzz

## Test Accounts

- Email: `admin@example.com`, Password: `admin123`
- Email: `user@example.com`, Password: `user123`

## API Documentation

See `MOBILE_APP_PROJECT_SUMMARY.md` for complete API documentation.

## Development

1. Start backend server first
2. Update API URL in `frontend/src/config/api.js` if needed
3. Start frontend development server
4. Test on emulator or physical device

## License

MIT
