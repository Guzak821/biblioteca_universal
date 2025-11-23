"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioDao = exports.mockUsuarios = void 0;
const UsuarioModel_1 = require("../models/UsuarioModel");
exports.mockUsuarios = [
    new UsuarioModel_1.UsuarioModel(1, 'admin', '1234', 'Bibliotecario'),
    new UsuarioModel_1.UsuarioModel(2, 'student1', '1234', 'Alumno'),
    new UsuarioModel_1.UsuarioModel(3, 'student2', '1234', 'Alumno'),
];
class UsuarioDao {
    findByUsuario(usuario) {
        const user = exports.mockUsuarios.find((u) => u.usuario === usuario);
        return user || null;
    }
    findAll() {
        return exports.mockUsuarios;
    }
    findById(id) {
        const user = exports.mockUsuarios.find((u) => u.id === id);
        return user || null;
    }
}
exports.UsuarioDao = UsuarioDao;
//# sourceMappingURL=UsuarioDao.js.map