import { UsuarioController } from './UsuarioController';
import { UsuarioModel } from '../libros/domain/models/UsuarioModel';

// NOTA: En un entorno real, esta información se almacenaría en una base de datos
// de sesión o se manejaría a través de un token JWT.
// Aquí simularemos el almacenamiento en el navegador (sessionStorage)
const SESSION_KEY = 'biblioteca_auth_session';

/**
 * Clase que simula el control de autenticación y la gestión de sesión.
 * Implementa el patrón MVC para la capa de Control.
 */
export class AuthController {
  private usuarioController: UsuarioController;

  constructor() {
    this.usuarioController = new UsuarioController();
  }

  /**
   * Intenta autenticar a un usuario y, si tiene éxito, inicia la sesión.
   * @param usuario Nombre de usuario.
   * @param contrasena Contraseña.
   * @returns Los datos del usuario (id y rol) si es exitoso.
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
    // eslint-disable-next-line @typescript-eslint/await-thenable
    const result = await this.usuarioController.handleLogin(
      usuario,
      contrasena,
    );

    if (result.success && result.user) {
      const user: UsuarioModel = result.user;

      // Simulación de inicio de sesión: Guardar datos en la sesión
      const sessionData = {
        userId: user.id,
        rol: user.rol,
        isAuthenticated: true,
        // En un entorno real, aquí se generaría y guardaría un JWT
      };

      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
      } catch (e) {
        console.error('Error al guardar en sessionStorage:', e);
        // Fallback si sessionStorage no está disponible
      }
      return {
        success: true,
        rol: user.rol,
        userId: user.id,
        message: 'Autenticación exitosa.',
      };
    }

    return {
      success: false,
      message: 'Credenciales incorrectas o usuario no encontrado.',
    };
  }

  /**
   * Cierra la sesión del usuario actual.
   */
  public logout(): void {
    sessionStorage.removeItem(SESSION_KEY);
    console.log('Sesión cerrada.');
  }

  /**
   * Obtiene la información de la sesión actual.
   * @returns El objeto de sesión (rol, userId) o null si no está autenticado.
   */
  public getCurrentUser(): {
    rol: 'Bibliotecario' | 'Alumno';
    userId: number;
  } | null {
    try {
      const sessionData = sessionStorage.getItem(SESSION_KEY);
      if (sessionData) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const user = JSON.parse(sessionData);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        if (user.isAuthenticated) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          return { rol: user.rol, userId: user.userId };
        }
      }
    } catch (e) {
      console.error('Error al leer sessionStorage:', e);
    }
    return null;
  }
}
