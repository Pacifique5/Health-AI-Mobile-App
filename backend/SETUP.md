# Backend Setup Instructions

## Quick Start

1. **Install dependencies:**
```bash
cd backend
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env
```

3. **Start development server:**
```bash
npm run start:dev
```

Server runs on `http://localhost:5000`

## Production Build

```bash
npm run build
npm run start:prod
```

## API Testing

Test the health endpoint:
```bash
curl http://localhost:5000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "message": "SymptomAI Backend is running"
}
```

## Dependencies
All required NestJS dependencies are included:
- @nestjs/common, @nestjs/core (framework)
- bcrypt (password hashing)
- class-validator (DTO validation)
- TypeScript support