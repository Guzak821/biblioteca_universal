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
    cleanBase64(base64String) {
        if (!base64String)
            return null;
        try {
            let cleaned = base64String;
            if (cleaned.startsWith('data:')) {
                cleaned = cleaned.split(',')[1];
            }
            cleaned = cleaned.replace(/\s/g, '');
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(cleaned)) {
                console.error('[LibroController] Base64 inválido detectado');
                return null;
            }
            if (cleaned.length < 100) {
                console.error('[LibroController] Base64 demasiado corto');
                return null;
            }
            return cleaned;
        }
        catch (error) {
            console.error('[LibroController] Error al limpiar base64:', error);
            return null;
        }
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
        const viewModelsInternos = LibroViewModel_1.LibroViewModel.fromModelArray(librosInternos, false);
        const [librosUnam, librosOxford] = await Promise.all([
            this.unamApiService.searchBooks(filtro),
            this.oxfordApiService.searchBooks(filtro),
        ]);
        const librosUnamMapped = librosUnam.map(libro => ({ ...libro, isExternal: true }));
        const librosOxfordMapped = librosOxford.map(libro => ({ ...libro, isExternal: true }));
        const todosLosLibros = [
            ...viewModelsInternos,
            ...librosUnamMapped,
            ...librosOxfordMapped,
        ];
        console.log(`[LibroController] Total de libros encontrados: ${todosLosLibros.length}`);
        return todosLosLibros;
    }
    async handleGetPdfContent(libroId, universidad, isExternal) {
        console.log(`[LibroController] Obteniendo PDF - ID: ${libroId}, Universidad: ${universidad}, Externo: ${isExternal}`);
        let pdfBase64 = null;
        try {
            if (!isExternal) {
                const libro = await this.libroDao.findById(Number(libroId));
                pdfBase64 = libro ? libro.pdfBase64 : null;
            }
            else {
                if (universidad === 'UNAM') {
                    console.log('[LibroController] Obteniendo PDF de UNAM...');
                    pdfBase64 = await this.unamApiService.getPdf(libroId);
                }
                else if (universidad === 'OXFORD') {
                    console.log('[LibroController] Obteniendo PDF de OXFORD...');
                    pdfBase64 = await this.oxfordApiService.getPdf(libroId);
                }
            }
            const cleanedBase64 = this.cleanBase64(pdfBase64);
            if (cleanedBase64) {
                console.log(`[LibroController] PDF limpio - Longitud: ${cleanedBase64.length} caracteres`);
                console.log(`[LibroController] Primeros 50 chars: ${cleanedBase64.substring(0, 50)}`);
                console.log(`[LibroController] Últimos 50 chars: ${cleanedBase64.substring(cleanedBase64.length - 50)}`);
            }
            else {
                console.error('[LibroController] No se pudo limpiar el base64 o está vacío');
            }
            return cleanedBase64;
        }
        catch (error) {
            console.error('[LibroController] Error al obtener PDF:', error);
            throw error;
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