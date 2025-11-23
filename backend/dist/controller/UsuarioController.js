"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioDao_1 = require("../libros/domain/dao/UsuarioDao");
const UsuarioCqrs_1 = require("../libros/aplication/mvc/UsuarioCqrs");
class UsuarioController {
    constructor() {
        this.usuarioDao = new UsuarioDao_1.UsuarioDao();
        this.usuarioCqrs = new UsuarioCqrs_1.UsuarioCqrs();
    }
    handleLogin(usuario, contrasena) {
        const user = this.usuarioDao.findByUsuario(usuario);
        if (user) {
            console.log(`Login exitoso para el usuario: ${user.usuario} con rol: ${user.rol}`);
            return {
                success: true,
                user: user,
                message: 'Credenciales válidas. Redirigiendo...',
            };
        }
        else {
            return {
                success: false,
                message: 'Credenciales incorrectas. Verifique usuario y/o contraseña.',
            };
        }
    }
    handleRegisterUser(user) {
        return this.usuarioCqrs.registerUser(user);
    }
    handleEditUser(user) {
        return this.usuarioCqrs.editUser(user);
    }
    async handleGetUsers() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const users = this.usuarioDao.findAll();
                resolve(users);
            }, 100);
        });
    }
    handleDeleteUser(id) {
        return this.usuarioCqrs.deleteUser(id);
    }
}
exports.UsuarioController = UsuarioController;
//# sourceMappingURL=UsuarioController.js.map