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
exports.LibroCqrs = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const LibroEntity_1 = require("../../LibroEntity");
const LibroModel_1 = require("../../domain/models/LibroModel");
const LibroDao_1 = require("../../domain/dao/LibroDao");
let LibroCqrs = class LibroCqrs {
    constructor(libroRepository, libroDao) {
        this.libroRepository = libroRepository;
        this.libroDao = libroDao;
    }
    async createLibro(dto) {
        console.log(`[CQRS] Ejecutando comando: Crear libro "${dto.titulo}"`);
        const exists = await this.libroDao.existsByTitulo(dto.titulo);
        if (exists) {
            throw new Error('Ya existe un libro con ese título');
        }
        const entity = this.libroRepository.create({
            titulo: dto.titulo,
            generoLiterario: dto.generoLiterario,
            portadaBase64: dto.portadaBase64,
            pdfBase64: dto.pdfBase64,
            universidadPropietaria: dto.universidadPropietaria || 'UTL',
        });
        const saved = await this.libroRepository.save(entity);
        return new LibroModel_1.LibroModel(saved.id, saved.titulo, saved.generoLiterario, saved.portadaBase64, saved.pdfBase64, saved.universidadPropietaria);
    }
    async updateLibro(id, dto) {
        console.log(`[CQRS] Ejecutando comando: Actualizar libro ID ${id}`);
        const entity = await this.libroRepository.findOne({ where: { id } });
        if (!entity) {
            return null;
        }
        if (dto.titulo)
            entity.titulo = dto.titulo;
        if (dto.generoLiterario)
            entity.generoLiterario = dto.generoLiterario;
        if (dto.portadaBase64)
            entity.portadaBase64 = dto.portadaBase64;
        if (dto.pdfBase64)
            entity.pdfBase64 = dto.pdfBase64;
        const updated = await this.libroRepository.save(entity);
        return new LibroModel_1.LibroModel(updated.id, updated.titulo, updated.generoLiterario, updated.portadaBase64, updated.pdfBase64, updated.universidadPropietaria);
    }
    async deleteLibro(id) {
        console.log(`[CQRS] Ejecutando comando: Eliminar libro ID ${id}`);
        const result = await this.libroRepository.delete(id);
        return result.affected > 0;
    }
};
exports.LibroCqrs = LibroCqrs;
exports.LibroCqrs = LibroCqrs = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(LibroEntity_1.LibroEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        LibroDao_1.LibroDao])
], LibroCqrs);
//# sourceMappingURL=LibroCqrs.js.map