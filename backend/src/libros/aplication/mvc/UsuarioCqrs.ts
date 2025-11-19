// backend/src/libros/aplicacion/commands/mvc/UsuarioCqrs.ts

import { UsuarioDao } from '../../domain/dao/UsuarioDao'; // Llama al DAO de forma interna
import { UsuarioModel } from '../../domain/models/UsuarioModel'; // Necesita el modelo de BD

/**
 * Clase que maneja los COMANDOS (modificaciones) para el subdominio de Usuarios.
 * Implementa el patrón CQRS (Command Query Responsibility Segregation).
 * El nombre del archivo incluye "Cqrs".
 */
export class UsuarioCqrs {
  private usuarioDao: UsuarioDao;

  constructor() {
    // CQRS realiza el llamado del DAO de forma interna.
    this.usuarioDao = new UsuarioDao();
  }

  // --- COMANDOS (Modificaciones) ---

  /**
   * Registra un nuevo usuario interno.
   * NO debe tener consultas.
   * @param user Datos del nuevo usuario (sin ID).
   * @returns El UsuarioModel registrado.
   */
  public registerUser(user: Omit<UsuarioModel, 'id'>): UsuarioModel {
    // 1. Aquí se podría poner lógica de negocio previa a guardar (ej. validaciones).
    console.log(`[CQRS] Ejecutando comando: Registrar usuario ${user.usuario}`);

    // 2. Llama al DAO para persistir los datos (la única acción permitida).
    // Nota: El DAO debe manejar el Modelo original de la BD, no el ViewModel[cite: 125].
    const nuevoUsuario = this.usuarioDao.save(user);

    // 3. Retorna el resultado (el objeto ya guardado).
    return nuevoUsuario;
  }

  /**
   * Edita un usuario interno existente.
   * @param user Datos del usuario actualizado (incluyendo ID).
   * @returns El UsuarioModel actualizado o null si no se encontró.
   */
  public editUser(user: UsuarioModel): UsuarioModel | null {
    // 1. Aquí se podría poner lógica de negocio previa a actualizar.
    console.log(`[CQRS] Ejecutando comando: Editar usuario ID ${user.id}`);

    // 2. Llama al DAO para actualizar los datos.
    const usuarioActualizado = this.usuarioDao.update(user);

    // 3. Retorna el resultado.
    return usuarioActualizado;
  }
}
