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
exports.LibroDao = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const LibroEntity_1 = require("../../LibroEntity");
const LibroModel_1 = require("../models/LibroModel");
let LibroDao = class LibroDao {
    constructor(libroRepository) {
        this.libroRepository = libroRepository;
    }
    async findAll() {
        const entities = await this.libroRepository.find({
            order: { id: 'ASC' },
        });
        return entities.map((e) => new LibroModel_1.LibroModel(e.id, e.titulo, e.generoLiterario, e.portadaBase64, e.pdfBase64, e.universidadPropietaria));
    }
    async findById(id) {
        const entity = await this.libroRepository.findOne({
            where: { id },
        });
        if (!entity)
            return null;
        return new LibroModel_1.LibroModel(entity.id, entity.titulo, entity.generoLiterario, entity.portadaBase64, entity.pdfBase64, entity.universidadPropietaria);
    }
    async searchByFilter(filtro) {
        if (!filtro || filtro.trim() === '') {
            console.log(`[LibroDao] Sin filtro - Retornando todos los libros`);
            return await this.findAll();
        }
        const filtroLower = filtro.toLowerCase().trim();
        console.log(`[LibroDao] 🔍 Buscando libros con filtro: "${filtroLower}"`);
        const todosLosLibros = await this.findAll();
        const librosCoincidentes = todosLosLibros.filter((libro) => {
            const tituloMatch = libro.titulo.toLowerCase().includes(filtroLower);
            const generoMatch = libro.generoLiterario.toLowerCase().includes(filtroLower);
            return tituloMatch || generoMatch;
        });
        console.log(`[LibroDao] Libros encontrados: ${librosCoincidentes.length} de ${todosLosLibros.length}`);
        if (librosCoincidentes.length === 0) {
            console.log(`[LibroDao] ℹ️ No se encontraron libros que coincidan con "${filtroLower}"`);
        }
        return librosCoincidentes;
    }
    async existsByTitulo(titulo) {
        const count = await this.libroRepository.count({
            where: { titulo },
        });
        return count > 0;
    }
};
exports.LibroDao = LibroDao;
exports.LibroDao = LibroDao = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(LibroEntity_1.LibroEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], LibroDao);
//# sourceMappingURL=LibroDao.js.map