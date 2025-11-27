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
        this.apiUrl = 'http://192.168.137.206:3000/libros';
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
                console.error('[UnamApiService] Base64 inválido');
                return null;
            }
            return cleaned;
        }
        catch (error) {
            console.error('[UnamApiService] Error al limpiar base64:', error);
            return null;
        }
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
                return LibroViewModel_1.LibroViewModel.fromModel(model, true);
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
            const pdfBase64 = data.pdfBase64 || data.pdf_base64 || null;
            if (!pdfBase64) {
                console.error('[UnamApiService] No se encontró el PDF en la respuesta');
                return null;
            }
            const cleanedBase64 = this.cleanBase64(pdfBase64);
            if (cleanedBase64) {
                console.log(`[UnamApiService] PDF limpio - Tamaño: ${cleanedBase64.length} caracteres`);
                console.log(`[UnamApiService] Primeros 50 chars: ${cleanedBase64.substring(0, 50)}`);
                console.log(`[UnamApiService] Últimos 50 chars: ${cleanedBase64.substring(cleanedBase64.length - 50)}`);
            }
            else {
                console.error('[UnamApiService] El base64 no es válido después de limpiarlo');
            }
            return cleanedBase64;
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