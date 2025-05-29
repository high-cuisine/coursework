import { Controller, Post, Body, ValidationPipe, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto, LoginDto } from '../../core/dto';
import { Public } from '../../core/decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    try {
      console.log('Registering user:', registerDto);
      return await this.authService.register(
        registerDto.username,
        registerDto.email,
        registerDto.password,
        registerDto.role,
      );
    } catch (error) {
      console.error('Registration error in controller:', error);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      
      throw new InternalServerErrorException('Registration failed: ' + error.message);
    }
  }

  @Public()
  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto.username, loginDto.password);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Login failed');
    }
  }
} 