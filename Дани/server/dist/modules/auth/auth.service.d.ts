import { Pool } from 'pg';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly pool;
    private readonly jwtService;
    constructor(pool: Pool, jwtService: JwtService);
    register(username: string, email: string, password: string, role?: string): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            role: string;
        };
    }>;
    login(username: string, password: string): Promise<{
        access_token: string;
        user: {
            id: number;
            username: string;
            email: string;
            role: string;
        };
    }>;
    private generateToken;
}
