export declare class AuthController {
    private authService;
    constructor();
    login(loginDto: {
        usuario: string;
        contrasena: string;
    }): Promise<{
        success: boolean;
        rol?: string;
        userId?: number;
        message: string;
    }>;
    logout(): {
        success: boolean;
        message: string;
    };
}
