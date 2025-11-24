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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioCqrs = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../../../usuarios/usuario.entity");
const UsuarioModel_1 = require("../../../usuarios/UsuarioModel");
const UsuarioDao_1 = require("../../../libros/domain/dao/UsuarioDao");
const bcrypt = require("bcrypt");
let UsuarioCqrs = class UsuarioCqrs {
    constructor(usuarioRepository, usuarioDao) {
        this.usuarioRepository = usuarioRepository;
        this.usuarioDao = usuarioDao;
    }
    async createUsuario(dto) {
        console.log(`[CQRS] Ejecutando comando: Registrar usuario ${dto.usuario}`);
        const exists = await this.usuarioDao.exists(dto.usuario);
        if (exists) {
            throw new Error('El usuario ya existe');
        }
        const hashedPassword = await bcrypt.hash(dto.contrasena, 10);
        const entity = this.usuarioRepository.create({
            usuario: dto.usuario,
            contrasena: hashedPassword,
            rol: dto.rol,
        });
        const saved = await this.usuarioRepository.save(entity);
        return new UsuarioModel_1.UsuarioModel(saved.id, saved.usuario, saved.contrasena, saved.rol);
    }
    async updateUsuario(id, dto) {
        console.log(`[CQRS] Ejecutando comando: Actualizar usuario ID ${id}`);
        const entity = await this.usuarioRepository.findOne({ where: { id } });
        if (!entity) {
            return null;
        }
        if (dto.usuario)
            entity.usuario = dto.usuario;
        if (dto.rol)
            entity.rol = dto.rol;
        if (dto.contrasena) {
            entity.contrasena = await bcrypt.hash(dto.contrasena, 10);
        }
        const updated = await this.usuarioRepository.save(entity);
        return new UsuarioModel_1.UsuarioModel(updated.id, updated.usuario, updated.contrasena, updated.rol);
    }
    async deleteUsuario(id) {
        console.log(`[CQRS] Ejecutando comando: Eliminar usuario ID ${id}`);
        const result = await this.usuarioRepository.delete(id);
        return result.affected > 0;
    }
};
exports.UsuarioCqrs = UsuarioCqrs;
exports.UsuarioCqrs = UsuarioCqrs = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.UsuarioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository, typeof (_a = typeof UsuarioDao_1.UsuarioDao !== "undefined" && UsuarioDao_1.UsuarioDao) === "function" ? _a : Object])
], UsuarioCqrs);
//# sourceMappingURL=UsuarioCqrs.js.map