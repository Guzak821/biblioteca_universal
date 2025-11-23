"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioCqrs = void 0;
const UsuarioDao_1 = require("../../domain/dao/UsuarioDao");
const UsuarioModel_1 = require("../../domain/models/UsuarioModel");
class UsuarioCqrs {
    constructor() {
        this.usuarioDao = new UsuarioDao_1.UsuarioDao();
    }
    registerUser(user) {
        console.log(`[CQRS] Ejecutando comando: Registrar usuario ${user.usuario}`);
        const existingUser = this.usuarioDao.findByUsuario(user.usuario);
        if (existingUser) {
            throw new Error('El usuario ya existe');
        }
        const newId = UsuarioDao_1.mockUsuarios.length > 0
            ? Math.max(...UsuarioDao_1.mockUsuarios.map((u) => u.id)) + 1
            : 1;
        const nuevoUsuario = new UsuarioModel_1.UsuarioModel(newId, user.usuario, user.contrasena, user.rol);
        UsuarioDao_1.mockUsuarios.push(nuevoUsuario);
        return nuevoUsuario;
    }
    editUser(user) {
        console.log(`[CQRS] Ejecutando comando: Editar usuario ID ${user.id}`);
        const index = UsuarioDao_1.mockUsuarios.findIndex((u) => u.id === user.id);
        if (index === -1) {
            console.log(`[CQRS] Usuario ID ${user.id} no encontrado`);
            return null;
        }
        UsuarioDao_1.mockUsuarios[index] = user;
        return UsuarioDao_1.mockUsuarios[index];
    }
    deleteUser(id) {
        console.log(`[CQRS] Ejecutando comando: Eliminar usuario ID ${id}`);
        const index = UsuarioDao_1.mockUsuarios.findIndex((u) => u.id === id);
        if (index === -1) {
            console.log(`[CQRS] Usuario ID ${id} no encontrado`);
            return false;
        }
        UsuarioDao_1.mockUsuarios.splice(index, 1);
        return true;
    }
}
exports.UsuarioCqrs = UsuarioCqrs;
//# sourceMappingURL=UsuarioCqrs.js.map