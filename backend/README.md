# SymptomAI Mobile - Backend

NestJS REST API for SymptomAI mobile application built with TypeScript.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Start the development server:
```bash
npm run start:dev
```

The server will run on `http://localhost:5000`

## Production Build

```bash
npm run build
npm run start:prod
```

## API Endpoints

### Health Check
```
GET /api/health
Response: { "status": "healthy", "message": "SymptomAI Backend is running" }
```

### Symptom Analysis
```
POST /api/analyze
Body: { "symptoms": "fever, cough, headache" }
Response: { "message": "✅ Possible Disease: Flu\n📄 Description: ..." }
```

### User Login
```
POST /api/login
Body: { "username": "email@example.com", "password": "password123" }
Response: { "message": "Login successful", "user": { "username": "...", "email": "..." } }
```

### User Signup
```
POST /api/signup
Body: { "username": "John Doe", "email": "john@example.com", "password": "password123" }
Response: { "message": "Signup successful" }
```

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   └── dto/
│   ├── symptom/           # Symptom analysis module
│   │   ├── symptom.controller.ts
│   │   ├── symptom.service.ts
│   │   ├── symptom.module.ts
│   │   └── dto/
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Tech Stack

- NestJS - Progressive Node.js framework
- TypeScript - Type-safe JavaScript
- Express - HTTP server
- bcrypt - Password hashing
- class-validator - DTO validation
- class-transformer - Object transformation

## Test Accounts

- Email: `admin@example.com`, Password: `admin123`
- Email: `user@example.com`, Password: `user123`

## Features

✅ RESTful API with NestJS
✅ TypeScript for type safety
✅ Modular architecture
✅ DTO validation
✅ CORS enabled
✅ Password hashing with bcrypt
✅ AI-powered symptom analysis
✅ Disease prediction with recommendations
