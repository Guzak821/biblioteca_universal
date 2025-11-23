import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './AuthService';

/**
 * Controlador de autenticación - Endpoints HTTP
 * Patrón MVC: Recibe peticiones y delega a la capa de servicio
 */
@Controller('api/auth')
export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * POST /api/auth/login
   * Endpoint de inicio de sesión
   */
  @Post('login')
  async login(
    @Body() loginDto: { usuario: string; contrasena: string },
  ) {
    const { usuario, contrasena } = loginDto;

    // Validación de entrada
    if (!usuario || !contrasena) {
      throw new HttpException(
        {
          success: false,
          message: 'Usuario y contraseña son requeridos',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    // Delega al servicio de autenticación
    const result = await this.authService.login(usuario, contrasena);

    if (!result.success) {
      throw new HttpException(
        result,
        HttpStatus.UNAUTHORIZED,
      );
    }

    return result;
  }

  /**
   * POST /api/auth/logout
   * Endpoint de cierre de sesión
   */
  @Post('logout')
  logout() {
    return {
      success: true,
      message: 'Sesión cerrada correctamente',
    };
  }
}