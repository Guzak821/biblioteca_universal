"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioDao = void 0;
const mockUsuarios = [
    { id: 1, usuario: 'admin', contrasena: '1234', rol: 'Bibliotecario' },
    { id: 2, usuario: 'student1', contrasena: '1234', rol: 'Alumno' },
    { id: 3, usuario: 'student2', contrasena: '1234', rol: 'Alumno' },
];
class UsuarioDao {
    findByUserAndPassword(usuario, contrasena) {
        const user = mockUsuarios.find((u) => u.usuario === usuario && u.contrasena === contrasena);
        return user ? user : null;
    }
    findAll() {
        return mockUsuarios;
    }
    save(user) {
        const newId = mockUsuarios.length + 1;
        const newUser = { id: newId, ...user };
        mockUsuarios.push(newUser);
        return newUser;
    }
    update(user) {
        const index = mockUsuarios.findIndex((u) => u.id === user.id);
        if (index !== -1) {
            mockUsuarios[index] = user;
            return mockUsuarios[index];
        }
        return null;
    }
    delete(id) {
        const initialLength = mockUsuarios.length;
        const index = mockUsuarios.findIndex((u) => u.id === id);
        if (index !== -1) {
            mockUsuarios.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.UsuarioDao = UsuarioDao;
//# sourceMappingURL=UsuarioDao.js.map