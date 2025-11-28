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
        this.apiUrl = 'http://192.168.137.1:8079/Cambridge/biblioteca/libro/getAllLibro';
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
                console.error('[OxfordApiService] Base64 inválido');
                return null;
            }
            return cleaned;
        }
        catch (error) {
            console.error('[OxfordApiService] Error al limpiar base64:', error);
            return null;
        }
    }
    async convertPdfUrlToBase64(pdfUrl) {
        try {
            console.log(`[OxfordApiService] Descargando PDF desde: ${pdfUrl}`);
            const response = await fetch(pdfUrl);
            if (!response.ok) {
                console.error(`[OxfordApiService] Error al descargar PDF: ${response.status}`);
                return null;
            }
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const base64 = buffer.toString('base64');
            console.log(`[OxfordApiService] PDF convertido a base64 - Tamaño: ${base64.length} caracteres`);
            return this.cleanBase64(base64);
        }
        catch (error) {
            console.error('[OxfordApiService] Error al convertir PDF a base64:', error);
            return null;
        }
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
            console.log(`[OxfordApiService] Cantidad de libros recibidos: ${data.length}`);
            return data.map((book) => {
                let cleanBookCover = book.bookCover || '';
                if (cleanBookCover && !cleanBookCover.startsWith('http')) {
                    if (!cleanBookCover.startsWith('data:')) {
                        cleanBookCover = `data:image/jpeg;base64,${cleanBookCover}`;
                    }
                }
                console.log(`[OxfordApiService] Mapeando libro: ${book.bookTitle} - UUID: ${book.uuid}`);
                const model = new LibroModel_1.LibroModel(book.uuid, book.bookTitle, book.genre || 'Unknown', cleanBookCover, book.pdfUrl || '', 'OXFORD');
                return LibroViewModel_1.LibroViewModel.fromModel(model, true);
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
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                console.error(`[OxfordApiService] Error HTTP: ${response.status}`);
                return null;
            }
            const data = await response.json();
            const book = data.find((b) => b.uuid === bookId);
            if (!book) {
                console.error("[OxfordApiService] Libro no encontrado");
                return null;
            }
            if (book.pdfUrl) {
                console.log(`[OxfordApiService] Convirtiendo PDF de URL a base64...`);
                return await this.convertPdfUrlToBase64(book.pdfUrl);
            }
            console.error("[OxfordApiService] El libro no tiene pdfUrl");
            return null;
        }
        catch (error) {
            console.error("[OxfordApiService] Error al obtener PDF:", error);
            return null;
        }
    }
};
exports.OxfordApiService = OxfordApiService;
exports.OxfordApiService = OxfordApiService = __decorate([
    (0, common_1.Injectable)()
], OxfordApiService);
//# sourceMappingURL=OxfordApiService.js.map