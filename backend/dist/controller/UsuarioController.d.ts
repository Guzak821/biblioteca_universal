import { UsuarioModel } from '../libros/domain/models/UsuarioModel';
export declare class UsuarioController {
    private usuarioDao;
    private usuarioCqrs;
    constructor();
    handleLogin(usuario: string, contrasena: string): {
        success: boolean;
        user?: UsuarioModel;
        message: string;
    };
    handleRegisterUser(user: Omit<UsuarioModel, 'id'>): UsuarioModel;
    handleEditUser(user: UsuarioModel): UsuarioModel | null;
    handleGetUsers(): Promise<UsuarioModel[]>;
    handleDeleteUser(id: number): boolean;
}
