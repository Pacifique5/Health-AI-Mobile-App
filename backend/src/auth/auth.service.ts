import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto, SignupDto } from './dto/auth.dto';

interface User {
  username: string;
  email: string;
  password: string;
}

@Injectable()
export class AuthService {
  private users: User[] = [
    {
      username: 'Admin User',
      email: 'admin@example.com',
      password: '$2b$10$YourHashedPasswordHere', // admin123
    },
    {
      username: 'Test User',
      email: 'user@example.com',
      password: '$2b$10$YourHashedPasswordHere', // user123
    },
  ];

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    
    const user = this.users.find(u => u.email === username);
    
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // For demo purposes, simple password check
    // In production, use bcrypt.compare(password, user.password)
    const isPasswordValid = password === 'admin123' || password === 'user123';
    
    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user: {
        username: user.username,
        email: user.email,
      },
    };
  }

  async signup(signupDto: SignupDto) {
    const { username, email, password } = signupDto;
    
    const existingUser = this.users.find(u => u.email === email);
    
    if (existingUser) {
      throw new Error('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser: User = {
      username,
      email,
      password: hashedPassword,
    };
    
    this.users.push(newUser);

    return {
      message: 'Signup successful',
    };
  }
}
