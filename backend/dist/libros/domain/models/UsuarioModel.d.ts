export interface UsuarioModel {
    id: number;
    usuario: string;
    contrasena: string;
    rol: 'Bibliotecario' | 'Alumno';
}
