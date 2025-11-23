"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthService_1 = require("../auth/AuthService");
const router = (0, express_1.Router)();
const authService = new AuthService_1.AuthService();
router.post('/login', async (req, res) => {
    try {
        const { usuario, contrasena } = req.body;
        if (!usuario || !contrasena) {
            return res.status(400).json({
                success: false,
                message: 'Usuario y contraseña son requeridos',
            });
        }
        const result = await authService.login(usuario, contrasena);
        if (result.success) {
            return res.status(200).json(result);
        }
        else {
            return res.status(401).json(result);
        }
    }
    catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
});
router.post('/logout', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Sesión cerrada correctamente',
    });
});
exports.default = router;
//# sourceMappingURL=auth.routes.js.map