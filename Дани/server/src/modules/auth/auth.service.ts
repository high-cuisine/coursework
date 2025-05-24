import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../core/types/database.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly pool: Pool,
    private readonly jwtService: JwtService,
  ) {}

  async register(username: string, email: string, password: string, role: string = 'user') {
    if (!password) {
      throw new UnauthorizedException('Password is required');
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = `
        INSERT INTO Users (username, email, password_hash, role)
        VALUES ($1, $2, $3, $4)
        RETURNING user_id, username, email, role;
      `;

      const result = await this.pool.query(query, [username, email, hashedPassword, role]);
      const user = result.rows[0];
      
      if (!user) {
        throw new UnauthorizedException('Failed to create user');
      }

      return this.generateToken(user);
    } catch (error) {
      if (error.code === '23505') { // Unique violation
        throw new UnauthorizedException('Username or email already exists');
      }
      console.log(error);
      throw new UnauthorizedException('Registration failed');
    }
  }

  async login(username: string, password: string) {
    if (!username || !password) {
      throw new UnauthorizedException('Username and password are required');
    }

    const query = `
      SELECT user_id, username, email, password_hash, role
      FROM Users
      WHERE username = $1;
    `;

    try {
      const result = await this.pool.query(query, [username]);
      const user = result.rows[0];

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password_hash);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      // Update last login
      await this.pool.query(
        'UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1',
        [user.user_id]
      );

      return this.generateToken(user);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }

  private generateToken(user: User) {
    const payload = {
      sub: user.user_id,
      username: user.username,
      role: user.role,
    };
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.user_id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    };
  }
} 