"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const pg_1 = require("pg");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(pool, jwtService) {
        this.pool = pool;
        this.jwtService = jwtService;
    }
    async register(username, email, password, role = 'user') {
        if (!password) {
            throw new common_1.UnauthorizedException('Password is required');
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
                throw new common_1.UnauthorizedException('Failed to create user');
            }
            return this.generateToken(user);
        }
        catch (error) {
            if (error.code === '23505') {
                throw new common_1.UnauthorizedException('Username or email already exists');
            }
            console.log(error);
            throw new common_1.UnauthorizedException('Registration failed');
        }
    }
    async login(username, password) {
        if (!username || !password) {
            throw new common_1.UnauthorizedException('Username and password are required');
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
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            if (!isPasswordValid) {
                throw new common_1.UnauthorizedException('Invalid credentials');
            }
            await this.pool.query('UPDATE Users SET last_login = CURRENT_TIMESTAMP WHERE user_id = $1', [user.user_id]);
            return this.generateToken(user);
        }
        catch (error) {
            if (error instanceof common_1.UnauthorizedException) {
                throw error;
            }
            throw new common_1.UnauthorizedException('Login failed');
        }
    }
    generateToken(user) {
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
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [pg_1.Pool,
        jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map