import { Injectable } from '@nestjs/common';
import { UsuarioController } from '../controller/UsuarioController';

/**
 * Servicio de autenticación - Lógica de negocio
 * Implementa el patrón MVC para la capa de Control
 */
@Injectable()
export class AuthService {
  private usuarioController: UsuarioController;

  constructor() {
    this.usuarioController = new UsuarioController();
  }

  /**
   * Intenta autenticar a un usuario
   * @param usuario Nombre de usuario
   * @param contrasena Contraseña
   * @returns Los datos del usuario (id y rol) si es exitoso
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
    // Delega la validación de credenciales al UsuarioController
    const result = await this.usuarioController.handleLogin(
      usuario,
      contrasena,
    );

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

  /**
   * Valida si un usuario está autenticado (para uso futuro con JWT)
   */
  public validateToken(token: string): boolean {
    // TODO: Implementar validación de JWT
    return false;
  }
}