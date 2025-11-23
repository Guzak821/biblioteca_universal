export declare class UsuarioModel {
    id: number;
    usuario: string;
    contrasena: string;
    rol: 'Bibliotecario' | 'Alumno';
    constructor(id: number, usuario: string, contrasena: string, rol: 'Bibliotecario' | 'Alumno');
}
