// backend/src/libros/domain/models/UsuarioModel.ts
export interface UsuarioModel {
  id: number;
  usuario: string;
  contrasena: string;
  rol: 'Bibliotecario' | 'Alumno';
}
