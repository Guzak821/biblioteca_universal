/**
 * Modelo de Usuario
 * Representa la estructura de datos del usuario
 */
export class UsuarioModel {
  id: number;
  usuario: string;
  contrasena: string;
  rol: 'Bibliotecario' | 'Alumno';

  constructor(
    id: number,
    usuario: string,
    contrasena: string,
    rol: 'Bibliotecario' | 'Alumno',
  ) {
    this.id = id;
    this.usuario = usuario;
    this.contrasena = contrasena;
    this.rol = rol;
  }
}