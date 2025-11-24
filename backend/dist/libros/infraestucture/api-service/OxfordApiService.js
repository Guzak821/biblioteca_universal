"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OxfordApiService = void 0;
const common_1 = require("@nestjs/common");
const LibroViewModel_1 = require("../../domain/view-model/LibroViewModel");
const LibroModel_1 = require("../../domain/models/LibroModel");
let OxfordApiService = class OxfordApiService {
    constructor() {
        this.apiUrl = 'http://localhost:3002/api/books';
    }
    async searchBooks(filtro) {
        try {
            console.log(`[OxfordApiService] Consultando API Oxford con filtro: "${filtro}"`);
            const response = await fetch(`${this.apiUrl}?search=${encodeURIComponent(filtro)}`);
            if (!response.ok) {
                console.error(`[OxfordApiService] Error HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return data.map((book) => {
                const model = new LibroModel_1.LibroModel(book.id, book.title || book.titulo, book.genre || book.genero || 'Unknown', book.cover || book.portada || '', book.pdf || book.pdfBase64 || '', 'OXFORD');
                return LibroViewModel_1.LibroViewModel.fromModel(model);
            });
        }
        catch (error) {
            console.error('[OxfordApiService] Error al consultar API Oxford:', error);
            return [];
        }
    }
    async getPdf(bookId) {
        try {
            console.log(`[OxfordApiService] Obteniendo PDF del libro ID: ${bookId}`);
            const response = await fetch(`${this.apiUrl}/${bookId}/pdf`);
            if (!response.ok) {
                console.error(`[OxfordApiService] Error al obtener PDF: ${response.status}`);
                return null;
            }
            const data = await response.json();
            return data.pdf || data.pdfBase64 || null;
        }
        catch (error) {
            console.error('[OxfordApiService] Error al obtener PDF:', error);
            return null;
        }
    }
};
exports.OxfordApiService = OxfordApiService;
exports.OxfordApiService = OxfordApiService = __decorate([
    (0, common_1.Injectable)()
], OxfordApiService);
//# sourceMappingURL=OxfordApiService.js.map