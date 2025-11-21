"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiServiceModule = void 0;
const LibroViewModel_1 = require("../../../src/libros/domain/view-model/LibroViewModel");
const mockUnamBooks = [
    {
        bookId: 'UNAM-1',
        bookTitle: 'Álgebra de Baldor',
        genre: 'Matemáticas',
        coverImage: 'base64_portada_baldor_unam',
        downloadPath: '/api/unam/download/UNAM-1',
    },
    {
        bookId: 'UNAM-2',
        bookTitle: 'Cálculo de Stewart',
        genre: 'Matemáticas',
        coverImage: 'base64_portada_stewart_unam',
        downloadPath: '/api/unam/download/UNAM-2',
    },
    {
        bookId: 'UNAM-3',
        bookTitle: 'Historia de México I',
        genre: 'Literatura',
        coverImage: 'base64_portada_historia_unam',
        downloadPath: '/api/unam/download/UNAM-3',
    },
];
class ApiServiceModule {
    async searchBooks(filtro) {
        console.log(`[ApiService: ${ApiServiceModule.UNIVERSITY_ID}] Buscando libros con filtro: ${filtro}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtroLower = filtro.toLowerCase();
                const filteredBooks = mockUnamBooks.filter((book) => book.bookTitle.toLowerCase().includes(filtroLower) ||
                    book.genre.toLowerCase().includes(filtroLower));
                const viewModels = filteredBooks.map((book) => LibroViewModel_1.LibroViewModelMapper.mapExternalBook(book, ApiServiceModule.UNIVERSITY_ID));
                resolve(viewModels);
            }, 300);
        });
    }
    async getBookPdf(libroId) {
        console.log(`[ApiService: ${ApiServiceModule.UNIVERSITY_ID}] Solicitando PDF para ID: ${libroId}`);
        return new Promise((resolve) => {
            setTimeout(() => {
                const book = mockUnamBooks.find((b) => b.bookId === libroId);
                if (book) {
                    resolve(`BASE64_PDF_COMPLETO_UNAM_ID_${libroId}`);
                }
                else {
                    resolve(null);
                }
            }, 500);
        });
    }
}
exports.ApiServiceModule = ApiServiceModule;
ApiServiceModule.UNIVERSITY_ID = 'UNAM';
//# sourceMappingURL=ApiServiceModule.js.map