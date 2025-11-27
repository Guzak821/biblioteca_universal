"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const common_1 = require("@nestjs/common");
const UsuarioDao_1 = require("../usuarios/domain/dao/UsuarioDao");
const UsuarioCqrs_1 = require("../usuarios/aplication/mvc/UsuarioCqrs");
const bcrypt = require("bcrypt");
let UsuarioController = class UsuarioController {
    constructor(usuarioDao, usuarioCqrs) {
        this.usuarioDao = usuarioDao;
        this.usuarioCqrs = usuarioCqrs;
    }
    async handleLogin(usuario, contrasena) {
        console.log(`[UsuarioController] Procesando login para: ${usuario}`);
        const user = await this.usuarioDao.findByUsuario(usuario);
        if (!user) {
            return {
                success: false,
                message: 'Credenciales incorrectas. Verifique usuario y/o contraseña.',
            };
        }
        const isValid = await bcrypt.compare(contrasena, user.contrasena);
        if (!isValid) {
            return {
                success: false,
                message: 'Credenciales incorrectas. Verifique usuario y/o contraseña.',
            };
        }
        console.log(`[UsuarioController] Login exitoso para: ${user.usuario} con rol: ${user.rol}`);
        return {
            success: true,
            user: user,
            message: 'Credenciales válidas. Redirigiendo...',
        };
    }
    async handleGetUsers() {
        console.log('[UsuarioController] Consultando todos los usuarios');
        return await this.usuarioDao.findAll();
    }
    async handleGetUserById(id) {
        console.log(`[UsuarioController] Consultando usuario ID: ${id}`);
        return await this.usuarioDao.findById(id);
    }
    async handleRegisterUser(dto) {
        console.log(`[UsuarioController] Registrando usuario: ${dto.usuario}`);
        return await this.usuarioCqrs.createUsuario(dto);
    }
    async handleEditUser(id, dto) {
        console.log(`[UsuarioController] Editando usuario ID: ${id}`);
        return await this.usuarioCqrs.updateUsuario(id, dto);
    }
    async handleDeleteUser(id) {
        console.log(`[UsuarioController] Eliminando usuario ID: ${id}`);
        return await this.usuarioCqrs.deleteUsuario(id);
    }
};
exports.UsuarioController = UsuarioController;
exports.UsuarioController = UsuarioController = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [UsuarioDao_1.UsuarioDao,
        UsuarioCqrs_1.UsuarioCqrs])
], UsuarioController);
//# sourceMappingURL=UsuarioController.js.map