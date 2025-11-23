import { UsuarioModel } from '../models/UsuarioModel';

// Mock de datos para simular una base de datos
export const mockUsuarios: UsuarioModel[] = [
  new UsuarioModel(1, 'admin', '1234', 'Bibliotecario'),
  new UsuarioModel(2, 'student1', '1234', 'Alumno'),
  new UsuarioModel(3, 'student2', '1234', 'Alumno'),
];

/**
 * UsuarioDao - Patrón DAO
 * SOLO contiene consultas a la base de datos (queries)
 * NO debe tener lógica de negocio
 */
export class UsuarioDao {
  /**
   * Consulta un usuario por nombre de usuario (para Login)
   * Patrón DAO: Solo consultas SELECT
   */
  public findByUsuario(usuario: string): UsuarioModel | null {
    const user = mockUsuarios.find((u) => u.usuario === usuario);
    return user || null;
  }

  /**
   * Consulta todos los usuarios internos
   * Para el CRUD del Bibliotecario
   */
  public findAll(): UsuarioModel[] {
    return mockUsuarios;
  }

  /**
   * Consulta un usuario por ID
   */
  public findById(id: number): UsuarioModel | null {
    const user = mockUsuarios.find((u) => u.id === id);
    return user || null;
  }
}