// backend/src/libros/domain/dao/UsuarioDao.ts

import { UsuarioModel } from '../models/UsuarioModel';
// Mock de datos para simular una base de datos
const mockUsuarios: UsuarioModel[] = [
  { id: 1, usuario: 'admin', contrasena: '1234', rol: 'Bibliotecario' },
  { id: 2, usuario: 'student1', contrasena: '1234', rol: 'Alumno' },
  { id: 3, usuario: 'student2', contrasena: '1234', rol: 'Alumno' },
];

/**
 * Clase que maneja todas las consultas y modificaciones a los datos de Usuario.
 */
export class UsuarioDao {
  // --- CONSULTAS (Usadas por MVC para Login/Listar) ---

  /**
   * Consulta un usuario por sus credenciales para el Login.
   * @param usuario El nombre de usuario.
   * @param contrasena La contraseña.
   * @returns El UsuarioModel si las credenciales son válidas, o null.
   */
  public findByUserAndPassword(
    usuario: string, // <-- Formato solicitado por Prettier
    contrasena: string, // <-- Parámetros en líneas separadas
  ): UsuarioModel | null {
    // Aquí se simula la consulta SELECT * FROM usuarios WHERE ...
    const user = mockUsuarios.find(
      (u) => u.usuario === usuario && u.contrasena === contrasena,
    );

    return user ? user : null;
  }

  /**
   * Consulta todos los usuarios internos (para el CRUD del Bibliotecario).
   * @returns Un arreglo de todos los UsuarioModel internos.
   */
  public findAll(): UsuarioModel[] {
    // Solo deben verse los usuarios propios/internos[cite: 38].
    return mockUsuarios;
  }

  // --- MODIFICACIONES (Usadas por CQRS) ---

  /**
   * Registra un nuevo usuario.
   * @param user El nuevo UsuarioModel a registrar.
   * @returns El UsuarioModel creado (simulando que la BD le asigna un ID).
   */
  public save(user: Omit<UsuarioModel, 'id'>): UsuarioModel {
    // Aquí se simula la inserción INSERT INTO usuarios (...)
    const newId = mockUsuarios.length + 1;
    const newUser: UsuarioModel = { id: newId, ...user };
    mockUsuarios.push(newUser);
    return newUser;
  }

  /**
   * Edita un usuario existente.
   * @param user El UsuarioModel con los datos actualizados.
   * @returns El UsuarioModel actualizado o null si no existe.
   */
  public update(user: UsuarioModel): UsuarioModel | null {
    // Aquí se simula la actualización UPDATE usuarios SET ... WHERE id = ...
    const index = mockUsuarios.findIndex((u) => u.id === user.id);

    if (index !== -1) {
      // Reemplazar el usuario en el mock
      mockUsuarios[index] = user;
      return mockUsuarios[index];
    }
    return null;
  }

  // (Podrías añadir un método 'delete' si fuera necesario)
}
