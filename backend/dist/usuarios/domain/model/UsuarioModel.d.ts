export declare class UsuarioModel {
    id: number;
    usuario: string;
    contrasena: string;
    rol: 'Bibliotecario' | 'Alumno';
    constructor(id: number, usuario: string, contrasena: string, rol: 'Bibliotecario' | 'Alumno');
}
export declare class CreateUsuarioDto {
    usuario: string;
    contrasena: string;
    rol: 'Bibliotecario' | 'Alumno';
}
export declare class UpdateUsuarioDto {
    usuario?: string;
    contrasena?: string;
    rol?: 'Bibliotecario' | 'Alumno';
}
