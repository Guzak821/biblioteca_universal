import { UsuarioModel } from '../../domain/models/UsuarioModel';
export declare class UsuarioCqrs {
    private usuarioDao;
    constructor();
    registerUser(user: Omit<UsuarioModel, 'id'>): UsuarioModel;
    editUser(user: UsuarioModel): UsuarioModel | null;
    deleteUser(id: number): boolean;
}
