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
exports.UsuarioDao = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const usuario_entity_1 = require("../../../usuarios/usuario.entity");
const UsuarioModel_1 = require("../../../usuarios/UsuarioModel");
let UsuarioDao = class UsuarioDao {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async findByUsuario(usuario) {
        const entity = await this.usuarioRepository.findOne({
            where: { usuario },
        });
        if (!entity)
            return null;
        return new UsuarioModel_1.UsuarioModel(entity.id, entity.usuario, entity.contrasena, entity.rol);
    }
    async findAll() {
        const entities = await this.usuarioRepository.find({
            order: { id: 'ASC' },
        });
        return entities.map((e) => new UsuarioModel_1.UsuarioModel(e.id, e.usuario, e.contrasena, e.rol));
    }
    async findById(id) {
        const entity = await this.usuarioRepository.findOne({
            where: { id },
        });
        if (!entity)
            return null;
        return new UsuarioModel_1.UsuarioModel(entity.id, entity.usuario, entity.contrasena, entity.rol);
    }
    async exists(usuario) {
        const count = await this.usuarioRepository.count({
            where: { usuario },
        });
        return count > 0;
    }
};
exports.UsuarioDao = UsuarioDao;
exports.UsuarioDao = UsuarioDao = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(usuario_entity_1.UsuarioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuarioDao);
//# sourceMappingURL=UsuarioDao.js.map