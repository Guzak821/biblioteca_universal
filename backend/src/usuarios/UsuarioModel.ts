/**
 * UsuarioModel - Modelo de dominio
 * DTO para transferencia de datos (sin campos internos de BD)
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

/**
 * DTO para crear usuario (sin ID ni contraseña hasheada)
 */
export class CreateUsuarioDto {
  usuario: string;
  contrasena: string;
  rol: 'Bibliotecario' | 'Alumno';
}

/**
 * DTO para actualizar usuario
 */
export class UpdateUsuarioDto {
  usuario?: string;
  contrasena?: string;
  rol?: 'Bibliotecario' | 'Alumno';
}
