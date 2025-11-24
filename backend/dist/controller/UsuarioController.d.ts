import { UsuarioDao } from '../usuarios/UsuarioDao';
import { UsuarioCqrs } from '../usuarios/UsuarioCqrs';
import { UsuarioModel, CreateUsuarioDto, UpdateUsuarioDto } from '../usuarios/UsuarioModel';
export declare class UsuarioController {
    private readonly usuarioDao;
    private readonly usuarioCqrs;
    constructor(usuarioDao: UsuarioDao, usuarioCqrs: UsuarioCqrs);
    handleLogin(usuario: string, contrasena: string): Promise<{
        success: boolean;
        user?: UsuarioModel;
        message: string;
    }>;
    handleGetUsers(): Promise<UsuarioModel[]>;
    handleGetUserById(id: number): Promise<UsuarioModel | null>;
    handleRegisterUser(dto: CreateUsuarioDto): Promise<UsuarioModel>;
    handleEditUser(id: number, dto: UpdateUsuarioDto): Promise<UsuarioModel | null>;
    handleDeleteUser(id: number): Promise<boolean>;
}
