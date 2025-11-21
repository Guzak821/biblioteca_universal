"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioCqrs = void 0;
const UsuarioDao_1 = require("../../domain/dao/UsuarioDao");
class UsuarioCqrs {
    constructor() {
        this.usuarioDao = new UsuarioDao_1.UsuarioDao();
    }
    registerUser(user) {
        console.log(`[CQRS] Ejecutando comando: Registrar usuario ${user.usuario}`);
        const nuevoUsuario = this.usuarioDao.save(user);
        return nuevoUsuario;
    }
    editUser(user) {
        console.log(`[CQRS] Ejecutando comando: Editar usuario ID ${user.id}`);
        const usuarioActualizado = this.usuarioDao.update(user);
        return usuarioActualizado;
    }
    deleteUser(id) {
        console.log(`[CQRS] Ejecutando comando: Eliminar usuario ID ${id}`);
        return this.usuarioDao.delete(id);
    }
}
exports.UsuarioCqrs = UsuarioCqrs;
//# sourceMappingURL=UsuarioCqrs.js.map