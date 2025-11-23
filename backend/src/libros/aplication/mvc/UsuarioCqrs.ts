import { UsuarioDao, mockUsuarios } from '../../domain/dao/UsuarioDao';
import { UsuarioModel } from '../../domain/models/UsuarioModel';

/**
 * UsuarioCqrs - Patrón CQRS (Command Query Responsibility Segregation)
 * Maneja SOLO los COMANDOS (modificaciones): INSERT, UPDATE, DELETE
 * Puede usar el DAO internamente SOLO para validaciones (consultas)
 * Flujo: MVC > CQRS > DAO (para validar) + Modificaciones directas
 */
export class UsuarioCqrs {
  private usuarioDao: UsuarioDao;

  constructor() {
    // CQRS realiza el llamado del DAO de forma interna
    this.usuarioDao = new UsuarioDao();
  }

  /**
   * Comando: Registra un nuevo usuario interno
   * NO debe tener consultas, solo modificaciones
   */
  public registerUser(user: Omit<UsuarioModel, 'id'>): UsuarioModel {
    console.log(`[CQRS] Ejecutando comando: Registrar usuario ${user.usuario}`);

    // 1. Validación usando DAO (consulta permitida para validar)
    const existingUser = this.usuarioDao.findByUsuario(user.usuario);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    // 2. Generar nuevo ID
    const newId =
      mockUsuarios.length > 0
        ? Math.max(...mockUsuarios.map((u) => u.id)) + 1
        : 1;

    // 3. Crear y guardar el nuevo usuario (modificación)
    const nuevoUsuario = new UsuarioModel(
      newId,
      user.usuario,
      user.contrasena,
      user.rol,
    );

    // Modificación directa al mock (simula INSERT INTO)
    mockUsuarios.push(nuevoUsuario);

    return nuevoUsuario;
  }

  /**
   * Comando: Edita un usuario interno existente
   */
  public editUser(user: UsuarioModel): UsuarioModel | null {
    console.log(`[CQRS] Ejecutando comando: Editar usuario ID ${user.id}`);

    // 1. Buscar el índice del usuario
    const index = mockUsuarios.findIndex((u) => u.id === user.id);

    if (index === -1) {
      console.log(`[CQRS] Usuario ID ${user.id} no encontrado`);
      return null;
    }

    // 2. Actualizar el usuario (simula UPDATE)
    mockUsuarios[index] = user;

    return mockUsuarios[index];
  }

  /**
   * Comando: Elimina un usuario
   */
  public deleteUser(id: number): boolean {
    console.log(`[CQRS] Ejecutando comando: Eliminar usuario ID ${id}`);

    // 1. Buscar el índice del usuario
    const index = mockUsuarios.findIndex((u) => u.id === id);

    if (index === -1) {
      console.log(`[CQRS] Usuario ID ${id} no encontrado`);
      return false;
    }

    // 2. Eliminar el usuario (simula DELETE)
    mockUsuarios.splice(index, 1);

    return true;
  }
}