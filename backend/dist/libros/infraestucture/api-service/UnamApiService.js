"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnamApiService = void 0;
const common_1 = require("@nestjs/common");
const LibroViewModel_1 = require("../../domain/view-model/LibroViewModel");
const LibroModel_1 = require("../../domain/models/LibroModel");
let UnamApiService = class UnamApiService {
    constructor() {
        this.apiUrl = 'http://localhost:3001/api/libros';
    }
    async searchBooks(filtro) {
        try {
            console.log(`[UnamApiService] Consultando API UNAM con filtro: "${filtro}"`);
            const response = await fetch(`${this.apiUrl}?filtro=${encodeURIComponent(filtro)}`);
            if (!response.ok) {
                console.error(`[UnamApiService] Error HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            return data.map((libro) => {
                const model = new LibroModel_1.LibroModel(libro.id, libro.titulo, libro.generoLiterario || libro.genero_literario || 'Sin género', libro.portadaBase64 || libro.portada_base64 || '', libro.pdfBase64 || libro.pdf_base64 || '', 'UNAM');
                return LibroViewModel_1.LibroViewModel.fromModel(model);
            });
        }
        catch (error) {
            console.error('[UnamApiService] Error al consultar API UNAM:', error);
            return [];
        }
    }
    async getPdf(libroId) {
        try {
            console.log(`[UnamApiService] Obteniendo PDF del libro ID: ${libroId}`);
            const response = await fetch(`${this.apiUrl}/${libroId}/pdf`);
            if (!response.ok) {
                console.error(`[UnamApiService] Error al obtener PDF: ${response.status}`);
                return null;
            }
            const data = await response.json();
            return data.pdfBase64 || data.pdf_base64 || null;
        }
        catch (error) {
            console.error('[UnamApiService] Error al obtener PDF:', error);
            return null;
        }
    }
};
exports.UnamApiService = UnamApiService;
exports.UnamApiService = UnamApiService = __decorate([
    (0, common_1.Injectable)()
], UnamApiService);
//# sourceMappingURL=UnamApiService.js.map