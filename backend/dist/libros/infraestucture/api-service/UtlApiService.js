"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtlApiService = void 0;
const common_1 = require("@nestjs/common");
const LibroViewModel_1 = require("../../domain/view-model/LibroViewModel");
const LibroModel_1 = require("../../domain/models/LibroModel");
let UtlApiService = class UtlApiService {
    constructor() {
        this.apiUrl = 'http://localhost:3003/api/libros';
    }
    async searchBooks(filtro) {
        try {
            console.log(`[UtlApiService] Consultando API UTL externa con filtro: "${filtro}"`);
            const response = await fetch(`${this.apiUrl}/search?q=${encodeURIComponent(filtro)}`);
            if (!response.ok) {
                console.error(`[UtlApiService] Error HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return data.map((libro) => {
                const model = new LibroModel_1.LibroModel(libro.id, libro.titulo, libro.genero || 'Sin categoría', libro.portada || '', libro.pdf || '', 'UTL-EXTERNA');
                return LibroViewModel_1.LibroViewModel.fromModel(model);
            });
        }
        catch (error) {
            console.error('[UtlApiService] Error al consultar API UTL:', error);
            return [];
        }
    }
    async getPdf(libroId) {
        try {
            console.log(`[UtlApiService] Obteniendo PDF del libro ID: ${libroId}`);
            const response = await fetch(`${this.apiUrl}/${libroId}/pdf`);
            if (!response.ok) {
                console.error(`[UtlApiService] Error al obtener PDF: ${response.status}`);
                return null;
            }
            const data = await response.json();
            return data.pdf || null;
        }
        catch (error) {
            console.error('[UtlApiService] Error al obtener PDF:', error);
            return null;
        }
    }
};
exports.UtlApiService = UtlApiService;
exports.UtlApiService = UtlApiService = __decorate([
    (0, common_1.Injectable)()
], UtlApiService);
//# sourceMappingURL=UtlApiService.js.map