import { UsuarioController } from '../controller/UsuarioController';
export declare class AuthService {
    private readonly usuarioController;
    constructor(usuarioController: UsuarioController);
    login(usuario: string, contrasena: string): Promise<{
        success: boolean;
        rol?: string;
        userId?: number;
        message: string;
    }>;
}
