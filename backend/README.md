# SymptomAI Mobile - Backend

NestJS REST API for SymptomAI mobile application built with TypeScript.

## ✅ Current Status

**FULLY FUNCTIONAL** - All endpoints tested and working!

- ✅ Authentication system with JWT
- ✅ User registration and login
- ✅ AI-powered symptom analysis
- ✅ Conversation management
- ✅ SQLite database integration
- ✅ Password hashing with bcrypt
- ✅ Input validation with DTOs
- ✅ CORS enabled for frontend

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run start:dev
```

Or build and run production:
```bash
npm run build
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /api/health
Response: { "status": "healthy", "message": "SymptomAI Backend is running" }
```

### Authentication

#### User Signup
```
POST /api/auth/signup
Body: { 
  "username": "John Doe", 
  "email": "john@example.com", 
  "password": "password123" 
}
Response: { 
  "access_token": "jwt_token_here",
  "user": { "id": "uuid", "username": "John Doe", "email": "john@example.com" }
}
```

#### User Login
```
POST /api/auth/login
Body: { "email": "john@example.com", "password": "password123" }
Response: { 
  "access_token": "jwt_token_here",
  "user": { "id": "uuid", "username": "John Doe", "email": "john@example.com" }
}
```

#### Get Profile (Protected)
```
GET /api/auth/profile
Headers: { "Authorization": "Bearer jwt_token_here" }
Response: { "id": "uuid", "username": "John Doe", "email": "john@example.com" }
```

### Symptom Analysis

#### Analyze Symptoms (Protected)
```
POST /api/symptoms/analyze
Headers: { "Authorization": "Bearer jwt_token_here" }
Body: { "symptoms": "fever, cough, headache" }
Response: { 
  "message": "✅ Possible Disease: Flu\n📄 Description: ...",
  "userId": "uuid",
  "timestamp": "2026-01-22T07:00:00.000Z"
}
```

### Conversations (All Protected)

#### Create Conversation
```
POST /api/conversations
Headers: { "Authorization": "Bearer jwt_token_here" }
Body: { "title": "My Health Consultation" }
Response: { "id": "uuid", "title": "My Health Consultation", ... }
```

#### Get All Conversations
```
GET /api/conversations
Headers: { "Authorization": "Bearer jwt_token_here" }
Response: [{ "id": "uuid", "title": "...", "messages": [...] }]
```

#### Get Specific Conversation
```
GET /api/conversations/:id
Headers: { "Authorization": "Bearer jwt_token_here" }
Response: { "id": "uuid", "title": "...", "messages": [...] }
```

#### Add Message to Conversation
```
POST /api/conversations/:id/messages
Headers: { "Authorization": "Bearer jwt_token_here" }
Body: { "content": "I have fever", "sender": "user" }
Response: { "id": "uuid", "content": "I have fever", "sender": "user", ... }
```

#### Delete Conversation
```
DELETE /api/conversations/:id
Headers: { "Authorization": "Bearer jwt_token_here" }
Response: { "message": "Conversation deleted successfully" }
```

## Database

Uses SQLite for development (database.sqlite file created automatically).
Database schema includes:
- **Users**: id, username, email, password, isActive, timestamps
- **Conversations**: id, title, lastMessage, user relation, timestamps  
- **Messages**: id, content, sender (user/ai), user relation, conversation relation, timestamp

## Project Structure

```
backend/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── auth.module.ts
│   │   ├── dto/auth.dto.ts
│   │   ├── guards/jwt-auth.guard.ts
│   │   └── strategies/jwt.strategy.ts
│   ├── conversations/     # Chat/conversation module
│   │   ├── conversations.controller.ts
│   │   ├── conversations.service.ts
│   │   └── conversations.module.ts
│   ├── symptom/           # Symptom analysis module
│   │   ├── symptom.controller.ts
│   │   ├── symptom.service.ts
│   │   ├── symptom.module.ts
│   │   └── dto/symptom.dto.ts
│   ├── entities/          # Database entities
│   │   ├── user.entity.ts
│   │   ├── conversation.entity.ts
│   │   └── message.entity.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   └── main.ts
├── package.json
├── tsconfig.json
└── nest-cli.json
```

## Tech Stack

- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **SQLite** - Lightweight database
- **TypeORM** - Database ORM
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **class-validator** - DTO validation
- **class-transformer** - Object transformation

## Disease Database

The symptom analysis includes comprehensive data for:
- **Flu** - fever, cough, headache, body aches, fatigue
- **Common Cold** - runny nose, sneezing, cough, sore throat
- **Migraine** - severe headache, nausea, light sensitivity
- **Gastroenteritis** - stomach pain, nausea, vomiting, diarrhea
- **Hypertension** - chest pain, shortness of breath, dizziness
- **Anxiety Disorder** - excessive worry, restlessness, fatigue
- **Diabetes Type 2** - increased thirst, frequent urination, fatigue

Each disease includes:
- Detailed description
- Recommended medications
- Treatment procedures
- Prevention precautions
- Specialist recommendations

## Features

✅ RESTful API with NestJS
✅ TypeScript for type safety
✅ Modular architecture
✅ JWT authentication
✅ Password hashing
✅ Input validation
✅ Database relationships
✅ CORS enabled
✅ AI-powered symptom analysis
✅ Conversation history
✅ Comprehensive error handling
