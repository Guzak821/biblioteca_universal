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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuariosController = void 0;
const common_1 = require("@nestjs/common");
const UsuarioController_1 = require("../controller/UsuarioController");
const UsuarioModel_1 = require("./domain/model/UsuarioModel");
let UsuariosController = class UsuariosController {
    constructor(usuarioController) {
        this.usuarioController = usuarioController;
    }
    async findAll() {
        try {
            const usuarios = await this.usuarioController.handleGetUsers();
            return usuarios.map((u) => ({
                id: u.id,
                usuario: u.usuario,
                rol: u.rol,
            }));
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener usuarios', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const usuario = await this.usuarioController.handleGetUserById(id);
            if (!usuario) {
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                id: usuario.id,
                usuario: usuario.usuario,
                rol: usuario.rol,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener usuario', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(dto) {
        try {
            const usuario = await this.usuarioController.handleRegisterUser(dto);
            return {
                success: true,
                message: 'Usuario creado exitosamente',
                data: {
                    id: usuario.id,
                    usuario: usuario.usuario,
                    rol: usuario.rol,
                },
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error al crear usuario', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, dto) {
        try {
            const usuario = await this.usuarioController.handleEditUser(id, dto);
            if (!usuario) {
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: {
                    id: usuario.id,
                    usuario: usuario.usuario,
                    rol: usuario.rol,
                },
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar usuario', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const deleted = await this.usuarioController.handleDeleteUser(id);
            if (!deleted) {
                throw new common_1.HttpException('Usuario no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Usuario eliminado exitosamente',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al eliminar usuario', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.UsuariosController = UsuariosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsuarioModel_1.CreateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, UsuarioModel_1.UpdateUsuarioDto]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UsuariosController.prototype, "remove", null);
exports.UsuariosController = UsuariosController = __decorate([
    (0, common_1.Controller)('api/usuarios'),
    __metadata("design:paramtypes", [UsuarioController_1.UsuarioController])
], UsuariosController);
//# sourceMappingURL=UsuariosController.js.map