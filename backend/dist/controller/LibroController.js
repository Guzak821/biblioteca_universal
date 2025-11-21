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
const LibrosService_1 = require("../libros/domain/service/LibrosService");
let LibrosController = class LibrosController {
    constructor(librosService) {
        this.librosService = librosService;
    }
    async searchBooks(filtro) {
        return this.librosService.searchBooks(filtro || '');
    }
    async getPdf(id, universidad, external) {
        const isExternal = external === 'true';
        const pdfBase64 = await this.librosService.getPdfContent(id, universidad, isExternal);
        if (!pdfBase64) {
            throw new common_1.HttpException('Libro o PDF no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return { pdfBase64 };
    }
    findAllAdmin() {
        return this.librosService.findAllInternalBooks();
    }
    create(createBookDto) {
        return this.librosService.registerBook(createBookDto);
    }
    update(id, updateBookDto) {
        const updatedBook = this.librosService.editBook({ ...updateBookDto, id: Number(id) });
        if (!updatedBook) {
            throw new common_1.HttpException('Libro no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return updatedBook;
    }
    remove(id) {
        const deleted = this.librosService.deleteBook(Number(id));
        if (!deleted) {
            throw new common_1.HttpException('Libro no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return { message: `Libro con ID ${id} eliminado correctamente.` };
    }
};
exports.LibrosController = LibrosController;
__decorate([
    (0, common_1.Get)('search'),
    __param(0, (0, common_1.Query)('filtro')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "searchBooks", null);
__decorate([
    (0, common_1.Get)('pdf'),
    __param(0, (0, common_1.Query)('id')),
    __param(1, (0, common_1.Query)('universidad')),
    __param(2, (0, common_1.Query)('external')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], LibrosController.prototype, "getPdf", null);
__decorate([
    (0, common_1.Get)('admin'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Array)
], LibrosController.prototype, "findAllAdmin", null);
__decorate([
    (0, common_1.Post)('admin'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Object)
], LibrosController.prototype, "create", null);
__decorate([
    (0, common_1.Put)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Object)
], LibrosController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)('admin/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Object)
], LibrosController.prototype, "remove", null);
exports.LibrosController = LibrosController = __decorate([
    (0, common_1.Controller)('libros'),
    __metadata("design:paramtypes", [LibrosService_1.LibrosService])
], LibrosController);
//# sourceMappingURL=LibroController.js.map