// backend/src/libros/controller/UsuarioController.ts

import { UsuarioDao } from '../libros/domain/dao/UsuarioDao'; // Importamos el DAO
import { UsuarioModel } from '../libros/domain/models/UsuarioModel'; // Importamos el Modelo
import { UsuarioCqrs } from '../libros/aplication/mvc/UsuarioCqrs'; // Importamos CQRS

/**
 * Clase que maneja las peticiones relacionadas con los Usuarios (Login y CRUD).
 */
export class UsuarioController {
  private usuarioDao: UsuarioDao;
  private usuarioCqrs: UsuarioCqrs;

  constructor() {
    this.usuarioDao = new UsuarioDao();
    this.usuarioCqrs = new UsuarioCqrs();
  }

  /**
   * Maneja la petición de Login.
   * @param usuario Nombre de usuario ingresado.
   * @param contrasena Contraseña ingresada.
   * @returns Un objeto con el estado del login y los datos del usuario (si es exitoso).
   */
  public handleLogin(
    usuario: string,
    contrasena: string,
  ): { success: boolean; user?: UsuarioModel; message: string } {
    // Desde el controlador, se realiza la validación usando el DAO (Lógica de negocio)[cite: 142].
    const user = this.usuarioDao.findByUserAndPassword(usuario, contrasena);

    if (user) {
      console.log(
        `Login exitoso para el usuario: ${user.usuario} con rol: ${user.rol}`,
      );
      return {
        success: true,
        user: user,
        message: 'Credenciales válidas. Redirigiendo...',
      };
    } else {
      return {
        success: false,
        message: 'Credenciales incorrectas. Verifique usuario y/o contraseña.',
      };
    }
  }

  /**
   * Maneja la petición de registro de un nuevo usuario.
   * El flujo es: MVC (Controller) -> CQRS -> DAO
   * @param user Los datos del usuario a registrar (sin ID).
   * @returns El usuario recién creado.
   */
  public handleRegisterUser(user: Omit<UsuarioModel, 'id'>): UsuarioModel {
    // Llama al CQRS para ejecutar el comando de modificación (registro)
    return this.usuarioCqrs.registerUser(user);
  }
  /**
   * Maneja la petición de edición de un usuario existente.
   * El flujo es: MVC (Controller) -> CQRS -> DAO
   * @param user Los datos actualizados del usuario (con ID).
   * @returns El usuario actualizado o un error.
   */
  public handleEditUser(user: UsuarioModel): UsuarioModel | null {
    // Llama al CQRS para ejecutar el comando de modificación (edición)
    return this.usuarioCqrs.editUser(user);
  }

  public async handleGetUsers(): Promise<UsuarioModel[]> {
    // Simular el retraso de una llamada de red (simula el I/O)
    return new Promise((resolve) => {
      setTimeout(() => {
        // Llama al DAO de forma síncrona dentro del retraso.
        const users = this.usuarioDao.findAll();
        resolve(users);
      }, 100); // Retraso de 100ms
    });
  }
  public handleDeleteUser(id: number): boolean {
    // Llama al CQRS para ejecutar el comando de modificación (eliminación)
    return this.usuarioCqrs.deleteUser(id);
  }
}
