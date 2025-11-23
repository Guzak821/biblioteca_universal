export declare class AuthService {
    private usuarioController;
    constructor();
    login(usuario: string, contrasena: string): Promise<{
        success: boolean;
        rol?: string;
        userId?: number;
        message: string;
    }>;
    validateToken(token: string): boolean;
}
