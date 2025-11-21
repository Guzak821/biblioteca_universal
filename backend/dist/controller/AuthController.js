"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const UsuarioController_1 = require("./UsuarioController");
const SESSION_KEY = 'biblioteca_auth_session';
class AuthController {
    constructor() {
        this.usuarioController = new UsuarioController_1.UsuarioController();
    }
    async login(usuario, contrasena) {
        const result = await this.usuarioController.handleLogin(usuario, contrasena);
        if (result.success && result.user) {
            const user = result.user;
            const sessionData = {
                userId: user.id,
                rol: user.rol,
                isAuthenticated: true,
            };
            try {
                sessionStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
            }
            catch (e) {
                console.error('Error al guardar en sessionStorage:', e);
            }
            return {
                success: true,
                rol: user.rol,
                userId: user.id,
                message: 'Autenticación exitosa.',
            };
        }
        return {
            success: false,
            message: 'Credenciales incorrectas o usuario no encontrado.',
        };
    }
    logout() {
        sessionStorage.removeItem(SESSION_KEY);
        console.log('Sesión cerrada.');
    }
    getCurrentUser() {
        try {
            const sessionData = sessionStorage.getItem(SESSION_KEY);
            if (sessionData) {
                const user = JSON.parse(sessionData);
                if (user.isAuthenticated) {
                    return { rol: user.rol, userId: user.userId };
                }
            }
        }
        catch (e) {
            console.error('Error al leer sessionStorage:', e);
        }
        return null;
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map