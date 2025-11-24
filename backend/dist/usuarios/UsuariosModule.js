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
exports.UsuariosModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const usuario_entity_1 = require("./usuario.entity");
const UsuarioDao_1 = require("../usuarios/UsuarioDao");
const UsuarioCqrs_1 = require("./UsuarioCqrs");
const UsuarioController_1 = require("../controller/UsuarioController");
const UsuariosController_1 = require("../usuarios/UsuariosController");
const typeorm_2 = require("typeorm");
const typeorm_3 = require("@nestjs/typeorm");
const bcrypt = require("bcrypt");
let UsuariosModule = class UsuariosModule {
    constructor(usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }
    async onModuleInit() {
        const adminExists = await this.usuarioRepository.findOne({
            where: { usuario: 'admin' },
        });
        if (!adminExists) {
            const admin = this.usuarioRepository.create({
                usuario: 'admin',
                contrasena: await bcrypt.hash('1234', 10),
                rol: 'Bibliotecario',
            });
            await this.usuarioRepository.save(admin);
            console.log('✅ Usuario admin creado: admin / 1234');
        }
        const studentExists = await this.usuarioRepository.findOne({
            where: { usuario: 'student1' },
        });
        if (!studentExists) {
            const student = this.usuarioRepository.create({
                usuario: 'student1',
                contrasena: await bcrypt.hash('1234', 10),
                rol: 'Alumno',
            });
            await this.usuarioRepository.save(student);
            console.log('✅ Usuario student1 creado: student1 / 1234');
        }
    }
};
exports.UsuariosModule = UsuariosModule;
exports.UsuariosModule = UsuariosModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([usuario_entity_1.UsuarioEntity])],
        controllers: [UsuariosController_1.UsuariosController],
        providers: [UsuarioDao_1.UsuarioDao, UsuarioCqrs_1.UsuarioCqrs, UsuarioController_1.UsuarioController],
        exports: [UsuarioController_1.UsuarioController, UsuarioDao_1.UsuarioDao, UsuarioCqrs_1.UsuarioCqrs],
    }),
    __param(0, (0, typeorm_3.InjectRepository)(usuario_entity_1.UsuarioEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsuariosModule);
//# sourceMappingURL=UsuariosModule.js.map