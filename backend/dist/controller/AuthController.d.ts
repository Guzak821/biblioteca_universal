export declare class AuthController {
    private usuarioController;
    constructor();
    login(usuario: string, contrasena: string): Promise<{
        success: boolean;
        rol?: string;
        userId?: number;
        message: string;
    }>;
    logout(): void;
    getCurrentUser(): {
        rol: 'Bibliotecario' | 'Alumno';
        userId: number;
    } | null;
}
