export declare class UsuarioEntity {
    id: number;
    usuario: string;
    contrasena: string;
    rol: 'Bibliotecario' | 'Alumno';
    created_at: Date;
    updated_at: Date;
}
