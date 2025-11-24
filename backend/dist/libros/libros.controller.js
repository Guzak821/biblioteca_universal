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
exports.LibrosController = void 0;
const common_1 = require("@nestjs/common");
const LibroController_1 = require("../controller/LibroController");
const LibroModel_1 = require("../libros/domain/models/LibroModel");
let LibrosController = class LibrosController {
    constructor(libroController) {
        this.libroController = libroController;
    }
    async findAll() {
        try {
            const libros = await this.libroController.handleGetAllInternalBooks();
            return libros.map((libro) => ({
                id: libro.id,
                titulo: libro.titulo,
                generoLiterario: libro.generoLiterario,
                portadaBase64: libro.portadaBase64,
                universidadPropietaria: libro.universidadPropietaria,
                pdfBase64: libro.pdfBase64,
            }));
        }
        catch (error) {
            throw new common_1.HttpException('Error al obtener libros', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async search(filtro) {
        try {
            const libros = await this.libroController.handleSearchBooks(filtro || '');
            return libros;
        }
        catch (error) {
            throw new common_1.HttpException('Error en la búsqueda', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async findOne(id) {
        try {
            const libro = await this.libroController.handleGetBookById(id);
            if (!libro) {
                throw new common_1.HttpException('Libro no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return libro;
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener libro', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async create(dto) {
        try {
            const libro = await this.libroController.handleCreateBook(dto);
            return {
                success: true,
                message: 'Libro creado exitosamente',
                data: libro,
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Error al crear libro', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, dto) {
        try {
            const libro = await this.libroController.handleUpdateBook(id, dto);
            if (!libro) {
                throw new common_1.HttpException('Libro no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Libro actualizado exitosamente',
                data: libro,
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al actualizar libro', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async remove(id) {
        try {
            const deleted = await this.libroController.handleDeleteBook(id);
            if (!deleted) {
                throw new common_1.HttpException('Libro no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return {
                success: true,
                message: 'Libro eliminado exitosamente',
            };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al eliminar libro', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getPdf(id, universidad, external) {
        try {
            const isExternal = external === 'true';
            const pdfBase64 = await this.libroController.handleGetPdfContent(id, universidad, isExternal);
            if (!pdfBase64) {
                throw new common_1.HttpException('PDF no encontrado', common_1.HttpStatus.NOT_FOUND);
            }
            return { pdfBase64 };
        }
        catch (error) {
            if (error instanceof common_1.HttpException)
                throw error;
            throw new common_1.HttpException('Error al obtener PDF', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
exports.LibrosController = LibrosController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('filtro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "search", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [LibroModel_1.CreateLibroDto]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, LibroModel_1.UpdateLibroDto]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "remove", null);
__decorate([
    (0, common_1.Get)('file/pdf'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('universidad')),
    __param(2, (0, common_1.Query)('external')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "getPdf", null);
exports.LibrosController = LibrosController = __decorate([
    (0, common_1.Controller)('api/libros'),
    __metadata("design:paramtypes", [LibroController_1.LibroController])
], LibrosController);
//# sourceMappingURL=libros.controller.js.map