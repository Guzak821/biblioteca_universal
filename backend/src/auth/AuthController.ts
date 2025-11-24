import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './AuthService';

/**
 * AuthController - Endpoints HTTP de autenticación
 */
@Controller('api/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  /**
   * POST /api/auth/login
   */
  @Post('login')
  async login(@Body() loginDto: { usuario: string; contrasena: string }) {
    const { usuario, contrasena } = loginDto;

    if (!usuario || !contrasena) {
      throw new HttpException(
        {
          success: false,
          message: 'Usuario y contraseña son requeridos',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.authService.login(usuario, contrasena);

    if (!result.success) {
      throw new HttpException(
        {
          success: false,
          message: result.message,
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    return result;
  }

  /**
   * POST /api/auth/logout
   */
  @Post('logout')
  logout() {
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  }
}