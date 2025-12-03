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
        this.apiUrl = 'http://192.168.137.87:3000/libros';
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
            console.log(`[UnamApiService] 🔍 Consultando API UNAM con filtro: "${filtro}"`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000);
            const url = `${this.apiUrl}${filtro ? `?filtro=${encodeURIComponent(filtro)}` : ''}`;
            console.log(`[UnamApiService] URL completa: ${url}`);
            console.log(`[UnamApiService] ⏱️ Esperando respuesta (timeout: 30s)...`);
            const startTime = Date.now();
            const response = await fetch(url, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            const elapsedTime = Date.now() - startTime;
            console.log(`[UnamApiService] ✓ Respuesta recibida en ${elapsedTime}ms`);
            if (!response.ok) {
                console.error(`[UnamApiService] ❌ Error HTTP: ${response.status}`);
                return [];
            }
            const responseData = await response.json();
            const librosArray = responseData.data || [];
            console.log(`[UnamApiService] ✓ Libros recibidos de la API: ${librosArray.length}`);
            if (librosArray.length > 0) {
                console.log(`[UnamApiService] 📖 Primer libro (muestra):`, {
                    idLibro: librosArray[0].idLibro,
                    titulo: librosArray[0].titulo,
                    descripcion: librosArray[0].descripcion
                });
            }
            const mappedBooks = librosArray.map((libro) => {
                const portada = libro.portadaUrl || '';
                const pdf = libro.pdfUrl || '';
                console.log(`[UnamApiService] Mapeando: "${libro.titulo}" | ID: ${libro.idLibro}`);
                const model = new LibroModel_1.LibroModel(libro.idLibro, libro.titulo, libro.descripcion || 'Sin género', portada, pdf, libro.universidad || 'UNAM');
                return LibroViewModel_1.LibroViewModel.fromModel(model, true);
            });
            console.log(`[UnamApiService] ✓ Libros mapeados exitosamente: ${mappedBooks.length}`);
            if (filtro && filtro.trim() !== '') {
                const filtroLower = filtro.toLowerCase().trim();
                const librosFiltrados = mappedBooks.filter((libro) => {
                    const tituloMatch = libro.titulo.toLowerCase().includes(filtroLower);
                    const generoMatch = libro.generoLiterario.toLowerCase().includes(filtroLower);
                    return tituloMatch || generoMatch;
                });
                console.log(`[UnamApiService] 🔍 Filtrado local aplicado: ${librosFiltrados.length} de ${mappedBooks.length} libros coinciden con "${filtro}"`);
                return librosFiltrados;
            }
            return mappedBooks;
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('[UnamApiService] ⏱️ TIMEOUT - La petición tardó más de 30 segundos');
                console.error('[UnamApiService] ❌ La API de UNAM no responde. Verifica:');
                console.error('[UnamApiService]    1. ¿La API está corriendo en http://192.168.137.109:3000?');
                console.error('[UnamApiService]    2. ¿Hay problemas de red/firewall?');
                console.error('[UnamApiService]    3. ¿La API está sobrecargada?');
            }
            else {
                console.error('[UnamApiService] ❌ Error al consultar API UNAM:', error.message);
                console.error('[UnamApiService] Stack:', error.stack);
            }
            return [];
        }
    }
    async getPdf(libroId) {
        try {
            const idString = String(libroId);
            console.log(`[UnamApiService] Obteniendo PDF del libro`);
            console.log(`[UnamApiService] ID recibido: ${libroId} (tipo: ${typeof libroId})`);
            console.log(`[UnamApiService] ID convertido a string: "${idString}"`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(this.apiUrl, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error(`[UnamApiService] ❌ Error HTTP: ${response.status}`);
                return null;
            }
            const responseData = await response.json();
            const librosArray = responseData.data || [];
            console.log(`[UnamApiService] 🔍 Buscando libro en ${librosArray.length} registros...`);
            console.log(`[UnamApiService] Buscando ID: "${idString}"`);
            const libro = librosArray.find((l) => {
                return String(l.idLibro) === idString;
            });
            if (!libro) {
                console.error(`[UnamApiService] ❌ Libro no encontrado con ID: ${idString}`);
                console.log(`[UnamApiService] IDs disponibles (primeros 10):`);
                librosArray.slice(0, 10).forEach((l, index) => {
                    console.log(`  ${index + 1}. "${l.idLibro}" (tipo: ${typeof l.idLibro}) - ${l.titulo}`);
                });
                return null;
            }
            console.log(`[UnamApiService] ✓ Libro encontrado: "${libro.titulo}"`);
            console.log(`[UnamApiService] Estructura del libro:`, {
                idLibro: libro.idLibro,
                titulo: libro.titulo,
                tienePdfUrl: !!libro.pdfUrl,
                longitudPdfUrl: libro.pdfUrl?.length || 0
            });
            const pdfDataUri = libro.pdfUrl;
            if (!pdfDataUri) {
                console.error('[UnamApiService] ❌ El libro no tiene pdfUrl');
                console.log('[UnamApiService] Campos disponibles:', Object.keys(libro));
                return null;
            }
            console.log(`[UnamApiService] ✓ PDF encontrado - Longitud: ${pdfDataUri.length} caracteres`);
            console.log(`[UnamApiService] Primeros 100 chars del PDF: ${pdfDataUri.substring(0, 100)}`);
            let cleanedBase64 = pdfDataUri;
            if (cleanedBase64.includes('base64,')) {
                const parts = cleanedBase64.split('base64,');
                if (parts.length === 2) {
                    cleanedBase64 = parts[1];
                    console.log('[UnamApiService] ✓ Removido prefijo Data URI');
                }
            }
            else if (cleanedBase64.startsWith('data:')) {
                const commaIndex = cleanedBase64.indexOf(',');
                if (commaIndex !== -1) {
                    cleanedBase64 = cleanedBase64.substring(commaIndex + 1);
                    console.log('[UnamApiService] ✓ Removido prefijo Data URI (método alternativo)');
                }
            }
            cleanedBase64 = cleanedBase64.replace(/\s/g, '');
            console.log(`[UnamApiService] ✓ Base64 limpio - Longitud: ${cleanedBase64.length} caracteres`);
            console.log(`[UnamApiService] Primeros 50 chars limpios: ${cleanedBase64.substring(0, 50)}`);
            console.log(`[UnamApiService] Últimos 50 chars limpios: ${cleanedBase64.substring(cleanedBase64.length - 50)}`);
            if (cleanedBase64.length < 100) {
                console.error(`[UnamApiService] ❌ Base64 muy corto: ${cleanedBase64.length} caracteres`);
                return null;
            }
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(cleanedBase64)) {
                console.error('[UnamApiService] ❌ Base64 contiene caracteres inválidos');
                return null;
            }
            console.log('[UnamApiService] ✓✓✓ PDF validado y listo para retornar');
            return cleanedBase64;
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('[UnamApiService] ⏱️ Timeout al obtener PDF (15 segundos)');
            }
            else {
                console.error('[UnamApiService] ❌ Error al obtener PDF:', error.message);
                console.error('[UnamApiService] Stack:', error.stack);
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