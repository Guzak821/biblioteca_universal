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
exports.LibroController = void 0;
const common_1 = require("@nestjs/common");
const LibroDao_1 = require("../libros/domain/dao/LibroDao");
const LibroCqrs_1 = require("../libros/aplication/mvc/LibroCqrs");
const LibroViewModel_1 = require("../libros/domain/view-model/LibroViewModel");
const UnamApiService_1 = require("../libros/infraestucture/api-service/UnamApiService");
const OxfordApiService_1 = require("../libros/infraestucture/api-service/OxfordApiService");
let LibroController = class LibroController {
    constructor(libroDao, libroCqrs, unamApiService, oxfordApiService) {
        this.libroDao = libroDao;
        this.libroCqrs = libroCqrs;
        this.unamApiService = unamApiService;
        this.oxfordApiService = oxfordApiService;
    }
    async handleGetAllInternalBooks() {
        console.log('[LibroController] Consultando libros internos');
        return await this.libroDao.findAll();
    }
    async handleGetBookById(id) {
        console.log(`[LibroController] Consultando libro ID: ${id}`);
        return await this.libroDao.findById(id);
    }
    async handleCreateBook(dto) {
        console.log(`[LibroController] Creando libro: ${dto.titulo}`);
        return await this.libroCqrs.createLibro(dto);
    }
    async handleUpdateBook(id, dto) {
        console.log(`[LibroController] Actualizando libro ID: ${id}`);
        return await this.libroCqrs.updateLibro(id, dto);
    }
    async handleDeleteBook(id) {
        console.log(`[LibroController] Eliminando libro ID: ${id}`);
        return await this.libroCqrs.deleteLibro(id);
    }
    async handleSearchBooks(filtro) {
        console.log(`[LibroController] Búsqueda global con filtro: "${filtro}"`);
        const librosInternos = await this.libroDao.searchByFilter(filtro);
        const viewModelsInternos = LibroViewModel_1.LibroViewModel.fromModelArray(librosInternos);
        const [librosUnam, librosOxford] = await Promise.all([
            this.unamApiService.searchBooks(filtro),
            this.oxfordApiService.searchBooks(filtro),
        ]);
        const todosLosLibros = [
            ...viewModelsInternos,
            ...librosUnam,
            ...librosOxford,
        ];
        console.log(`[LibroController] Total de libros encontrados: ${todosLosLibros.length}`);
        return todosLosLibros;
    }
    async handleGetPdfContent(libroId, universidad, isExternal) {
        console.log(`[LibroController] Obteniendo PDF - ID: ${libroId}, Universidad: ${universidad}, Externo: ${isExternal}`);
        if (!isExternal) {
            const libro = await this.libroDao.findById(Number(libroId));
            return libro ? libro.pdfBase64 : null;
        }
        else {
            if (universidad === 'UNAM') {
                return await this.unamApiService.getPdf(libroId);
            }
            else if (universidad === 'OXFORD') {
                return await this.oxfordApiService.getPdf(libroId);
            }
            return null;
        }
    }
};
exports.LibroController = LibroController;
exports.LibroController = LibroController = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [LibroDao_1.LibroDao,
        LibroCqrs_1.LibroCqrs,
        UnamApiService_1.UnamApiService,
        OxfordApiService_1.OxfordApiService])
], LibroController);
//# sourceMappingURL=LibroController.js.map