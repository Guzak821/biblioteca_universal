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
    cleanBase64(base64String, keepDataUri = false) {
        if (!base64String)
            return null;
        try {
            let cleaned = base64String;
            if (keepDataUri && cleaned.startsWith('data:')) {
                return cleaned;
            }
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
            console.log(`[UnamApiService] URL completa: ${this.apiUrl}?filtro=${encodeURIComponent(filtro)}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(`${this.apiUrl}?filtro=${encodeURIComponent(filtro)}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error(`[UnamApiService] Error HTTP: ${response.status}`);
                return [];
            }
            const responseData = await response.json();
            console.log(`[UnamApiService] Estructura de respuesta:`, {
                success: responseData.success,
                tieneData: !!responseData.data,
                esArray: Array.isArray(responseData.data),
                cantidad: responseData.data?.length || 0
            });
            const librosArray = responseData.data || [];
            if (!Array.isArray(librosArray)) {
                console.error('[UnamApiService] data no es un array');
                return [];
            }
            console.log(`[UnamApiService] Cantidad de libros: ${librosArray.length}`);
            if (librosArray.length > 0) {
                console.log(`[UnamApiService] Primer libro (muestra):`, {
                    idLibro: librosArray[0].idLibro,
                    titulo: librosArray[0].titulo,
                    universidad: librosArray[0].universidad,
                    tienePortada: !!librosArray[0].portadaUrl,
                    tienePdf: !!librosArray[0].pdfUrl
                });
            }
            const mappedBooks = librosArray.map((libro) => {
                console.log(`[UnamApiService] Mapeando libro: ${libro.titulo} (ID: ${libro.idLibro})`);
                const portada = libro.portadaUrl || '';
                const pdf = libro.pdfUrl || '';
                const model = new LibroModel_1.LibroModel(libro.idLibro, libro.titulo, libro.descripcion || 'Sin género', portada, pdf, libro.universidad || 'UNAM');
                return LibroViewModel_1.LibroViewModel.fromModel(model, true);
            });
            console.log(`[UnamApiService] Libros mapeados exitosamente: ${mappedBooks.length}`);
            return mappedBooks;
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('[UnamApiService] Timeout - La petición tardó más de 10 segundos');
            }
            else {
                console.error('[UnamApiService] Error al consultar API UNAM:', error.message);
                console.error('[UnamApiService] Stack:', error.stack);
            }
            return [];
        }
    }
    async getPdf(libroId) {
        try {
            console.log(`[UnamApiService] Obteniendo PDF del libro ID: ${libroId}`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(this.apiUrl, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error(`[UnamApiService] Error HTTP: ${response.status}`);
                return null;
            }
            const responseData = await response.json();
            const librosArray = responseData.data || [];
            const libro = librosArray.find((l) => l.idLibro === libroId);
            if (!libro) {
                console.error('[UnamApiService] Libro no encontrado');
                return null;
            }
            const pdfDataUri = libro.pdfUrl;
            if (!pdfDataUri) {
                console.error('[UnamApiService] El libro no tiene pdfUrl');
                return null;
            }
            const cleanedBase64 = this.cleanBase64(pdfDataUri, false);
            if (cleanedBase64) {
                console.log(`[UnamApiService] PDF limpio - Tamaño: ${cleanedBase64.length} caracteres`);
                console.log(`[UnamApiService] Primeros 50 chars: ${cleanedBase64.substring(0, 50)}`);
            }
            else {
                console.error('[UnamApiService] No se pudo limpiar el base64');
            }
            return cleanedBase64;
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('[UnamApiService] Timeout al obtener PDF');
            }
            else {
                console.error('[UnamApiService] Error al obtener PDF:', error.message);
            }
            return null;
        }
    }
};
exports.UnamApiService = UnamApiService;
exports.UnamApiService = UnamApiService = __decorate([
    (0, common_1.Injectable)()
], UnamApiService);
//# sourceMappingURL=UnamApiService.js.map