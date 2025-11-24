import { Injectable } from '@nestjs/common';
import { UsuarioController } from '../controller/UsuarioController';

/**
 * AuthService - Lógica de autenticación
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioController: UsuarioController,
  ) {}

  /**
   * Login - Validar credenciales
   */
  public async login(
    usuario: string,
    contrasena: string,
  ): Promise<{
    success: boolean;
    rol?: string;
    userId?: number;
    message: string;
  }> {
    const result = await this.usuarioController.handleLogin(usuario, contrasena);

    if (result.success && result.user) {
      return {
        success: true,
        rol: result.user.rol,
        userId: result.user.id,
        message: 'Autenticación exitosa.',
      };
    }

    return {
      success: false,
      message: 'Credenciales incorrectas o usuario no encontrado.',
    };
  }
}