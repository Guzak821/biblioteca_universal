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
        this.uuidMap = new Map();
    }
    uuidToNumericId(uuid) {
        for (const [id, storedUuid] of this.uuidMap.entries()) {
            if (storedUuid === uuid) {
                return id;
            }
        }
        let hash = 0;
        for (let i = 0; i < uuid.length; i++) {
            const char = uuid.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        const numericId = Math.abs(hash);
        this.uuidMap.set(numericId, uuid);
        console.log(`[OxfordApiService] 🔑 Mapeando: ${numericId} → ${uuid}`);
        return numericId;
    }
    numericIdToUuid(id) {
        if (typeof id === 'string') {
            return this.extractUUID(id);
        }
        const uuid = this.uuidMap.get(id);
        if (uuid) {
            return uuid;
        }
        return this.extractUUID(id.toString());
    }
    extractUUID(id) {
        if (id.startsWith('Cambridge-')) {
            return id.replace('Cambridge-', '');
        }
        return id;
    }
    cleanBase64(base64String) {
        if (!base64String) {
            console.log('[OxfordApiService] ⚠️ Base64 string vacío o null');
            return null;
        }
        try {
            let cleaned = base64String.trim();
            console.log(`[OxfordApiService] Base64 original - Longitud: ${cleaned.length}`);
            console.log(`[OxfordApiService] Primeros 100 chars originales: ${cleaned.substring(0, 100)}`);
            if (cleaned.includes('base64,')) {
                const parts = cleaned.split('base64,');
                if (parts.length === 2) {
                    cleaned = parts[1];
                    console.log('[OxfordApiService] ✓ Removido prefijo Data URI (método 1)');
                }
            }
            else if (cleaned.startsWith('data:')) {
                const commaIndex = cleaned.indexOf(',');
                if (commaIndex !== -1) {
                    cleaned = cleaned.substring(commaIndex + 1);
                    console.log('[OxfordApiService] ✓ Removido prefijo Data URI (método 2)');
                }
            }
            cleaned = cleaned.replace(/\s/g, '');
            const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
            if (!base64Regex.test(cleaned)) {
                console.error('[OxfordApiService] ❌ Base64 inválido - contiene caracteres no permitidos');
                console.error('[OxfordApiService] Primeros 200 chars: ', cleaned.substring(0, 200));
                return null;
            }
            if (cleaned.length < 100) {
                console.error(`[OxfordApiService] ❌ Base64 muy corto: ${cleaned.length} caracteres`);
                return null;
            }
            console.log(`[OxfordApiService] ✓ Base64 limpio - Longitud: ${cleaned.length} caracteres`);
            console.log(`[OxfordApiService] Primeros 50 chars limpios: ${cleaned.substring(0, 50)}`);
            console.log(`[OxfordApiService] Últimos 50 chars limpios: ${cleaned.substring(cleaned.length - 50)}`);
            return cleaned;
        }
        catch (error) {
            console.error('[OxfordApiService] ❌ Error al limpiar base64:', error);
            return null;
        }
    }
    async searchBooks(filtro) {
        try {
            console.log(`[OxfordApiService] 🔍 Consultando API Oxford con filtro: "${filtro}"`);
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000);
            const response = await fetch(`${this.apiUrl}?search=${encodeURIComponent(filtro)}`, {
                signal: controller.signal,
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                }
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error(`[OxfordApiService] ❌ Error HTTP: ${response.status}`);
                return [];
            }
            const data = await response.json();
            const librosArray = Array.isArray(data) ? data : (data.data || []);
            console.log(`[OxfordApiService] ✓ Cantidad de libros recibidos: ${librosArray.length}`);
            if (librosArray.length > 0) {
                console.log(`[OxfordApiService] 📖 Primer libro (muestra):`, {
                    uuid: librosArray[0].uuid,
                    bookTitle: librosArray[0].bookTitle,
                    tienePortada: !!librosArray[0].bookCover,
                    tienePdfUrl: !!librosArray[0].pdfUrl,
                    tienePdfBase64: !!librosArray[0].pdfBase64
                });
            }
            let mappedBooks = librosArray.map((book) => {
                let cleanBookCover = book.bookCover || '';
                if (cleanBookCover && !cleanBookCover.startsWith('http')) {
                    if (!cleanBookCover.startsWith('data:')) {
                        cleanBookCover = `data:image/jpeg;base64,${cleanBookCover}`;
                    }
                }
                console.log(`[OxfordApiService] 📚 Mapeando libro: ${book.bookTitle} - UUID: ${book.uuid}`);
                const hashId = this.uuidToNumericId(book.uuid);
                console.log(`[OxfordApiService] UUID: ${book.uuid} → ID numérico: ${hashId}`);
                let pdfData = book.pdfBase64 || book.pdfUrl || '';
                const model = new LibroModel_1.LibroModel(hashId, book.bookTitle, book.genre || 'Unknown', cleanBookCover, pdfData, 'Cambridge');
                return LibroViewModel_1.LibroViewModel.fromModel(model, true);
            });
            console.log(`[OxfordApiService] ✓ Libros mapeados exitosamente: ${mappedBooks.length}`);
            if (filtro && filtro.trim() !== '') {
                const filtroLower = filtro.toLowerCase().trim();
                mappedBooks = mappedBooks.filter((libro) => {
                    const tituloMatch = libro.titulo.toLowerCase().includes(filtroLower);
                    const generoMatch = libro.generoLiterario.toLowerCase().includes(filtroLower);
                    return tituloMatch || generoMatch;
                });
                console.log(`[OxfordApiService] 🔍 Filtrado local aplicado: ${mappedBooks.length} libros coinciden con "${filtro}"`);
            }
            return mappedBooks;
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('[OxfordApiService] ⏱️ Timeout - La petición tardó más de 10 segundos');
            }
            else {
                console.error('[OxfordApiService] ❌ Error al consultar API Oxford:', error.message);
            }
            return [];
        }
    }
    async getPdf(bookId) {
        try {
            console.log(`[OxfordApiService] 📥 getPdf llamado con ID:`, bookId, `(tipo: ${typeof bookId})`);
            let realUUID;
            const numericBookId = typeof bookId === 'number' ? bookId : parseInt(bookId);
            if (!isNaN(numericBookId)) {
                const mappedUuid = this.uuidMap.get(numericBookId);
                if (mappedUuid) {
                    realUUID = mappedUuid;
                    console.log(`[OxfordApiService] ✓ ID numérico ${numericBookId} encontrado en mapa → UUID: ${realUUID}`);
                }
                else {
                    console.error(`[OxfordApiService] ❌ ID numérico ${numericBookId} NO encontrado en mapa`);
                    console.log(`[OxfordApiService] 📋 Mapa actual tiene ${this.uuidMap.size} entradas`);
                    let count = 0;
                    for (const [id, uuid] of this.uuidMap.entries()) {
                        if (count < 5) {
                            console.log(`  ${id} → ${uuid}`);
                            count++;
                        }
                    }
                    return null;
                }
            }
            else {
                realUUID = this.extractUUID(bookId.toString());
                console.log(`[OxfordApiService] ✓ String ID → UUID: ${realUUID}`);
            }
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000);
            const response = await fetch(this.apiUrl, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            if (!response.ok) {
                console.error(`[OxfordApiService] ❌ Error HTTP: ${response.status}`);
                return null;
            }
            const data = await response.json();
            const librosArray = Array.isArray(data) ? data : (data.data || []);
            console.log(`[OxfordApiService] 🔍 Buscando libro en ${librosArray.length} registros...`);
            console.log(`[OxfordApiService] Buscando UUID: "${realUUID}"`);
            const book = librosArray.find((b) => b.uuid === realUUID);
            if (!book) {
                console.error(`[OxfordApiService] ❌ Libro no encontrado con UUID: ${realUUID}`);
                console.log(`[OxfordApiService] 📋 UUIDs disponibles en la respuesta (primeros 10):`);
                librosArray.slice(0, 10).forEach((b, index) => {
                    console.log(`  ${index + 1}. "${b.uuid}" - ${b.bookTitle}`);
                });
                console.log(`[OxfordApiService] 🔍 Intentando búsqueda case-insensitive...`);
                const bookAlt = librosArray.find((b) => b.uuid.toLowerCase() === realUUID.toLowerCase());
                if (bookAlt) {
                    console.log(`[OxfordApiService] ✓ Libro encontrado con búsqueda case-insensitive: ${bookAlt.bookTitle}`);
                    return await this.processPdfFromBook(bookAlt);
                }
                return null;
            }
            console.log(`[OxfordApiService] ✓ Libro encontrado: ${book.bookTitle}`);
            return await this.processPdfFromBook(book);
        }
        catch (error) {
            if (error.name === 'AbortError') {
                console.error('[OxfordApiService] ⏱️ Timeout al obtener PDF (15 segundos)');
            }
            else {
                console.error('[OxfordApiService] ❌ Error al obtener PDF:', error.message);
                console.error('[OxfordApiService] Stack:', error.stack);
            }
            return null;
        }
    }
    async processPdfFromBook(book) {
        try {
            console.log(`[OxfordApiService] 📋 Procesando PDF del libro: ${book.bookTitle}`);
            console.log(`[OxfordApiService] 📋 Estructura del libro:`, {
                uuid: book.uuid,
                tienePdfUrl: !!book.pdfUrl,
                tienePdfBase64: !!book.pdfBase64,
                tienePdf: !!book.pdf,
                tipoPdfUrl: typeof book.pdfUrl,
                longitudPdfUrl: book.pdfUrl?.length || 0,
                longitudPdfBase64: book.pdfBase64?.length || 0
            });
            let pdfData = book.pdfBase64 || book.pdfUrl || book.pdf || '';
            if (!pdfData) {
                console.error('[OxfordApiService] ❌ El libro no tiene datos PDF en ningún campo');
                console.log('[OxfordApiService] Campos del libro disponibles:', Object.keys(book));
                return null;
            }
            console.log(`[OxfordApiService] ✓ PDF encontrado - Longitud: ${pdfData.length} caracteres`);
            console.log(`[OxfordApiService] Primeros 150 chars del PDF: ${pdfData.substring(0, 150)}`);
            console.log(`[OxfordApiService] El PDF empieza con: ${pdfData.startsWith('http') ? 'URL' : pdfData.startsWith('data:') ? 'Data URI' : 'Base64 puro'}`);
            if (pdfData.startsWith('http://') || pdfData.startsWith('https://')) {
                console.log(`[OxfordApiService] 🌐 PDF es una URL, intentando descargar: ${pdfData}`);
                try {
                    const pdfResponse = await fetch(pdfData);
                    if (!pdfResponse.ok) {
                        console.error(`[OxfordApiService] ❌ Error al descargar PDF: ${pdfResponse.status}`);
                        return null;
                    }
                    const arrayBuffer = await pdfResponse.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);
                    pdfData = buffer.toString('base64');
                    console.log(`[OxfordApiService] ✓ PDF descargado y convertido - Tamaño: ${pdfData.length} caracteres`);
                }
                catch (downloadError) {
                    console.error('[OxfordApiService] ❌ Error al descargar PDF desde URL:', downloadError);
                    return null;
                }
            }
            console.log(`[OxfordApiService] 🧹 Limpiando base64...`);
            const cleanedBase64 = this.cleanBase64(pdfData);
            if (!cleanedBase64) {
                console.error('[OxfordApiService] ❌ No se pudo limpiar el base64');
                return null;
            }
            console.log('[OxfordApiService] ✓✓✓ PDF validado y listo para retornar');
            return cleanedBase64;
        }
        catch (error) {
            console.error('[OxfordApiService] ❌ Error al procesar PDF del libro:', error);
            return null;
        }
    }
};
exports.OxfordApiService = OxfordApiService;
exports.OxfordApiService = OxfordApiService = __decorate([
    (0, common_1.Injectable)()
], OxfordApiService);
//# sourceMappingURL=OxfordApiService.js.map