import { AuthService } from './AuthService';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
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
