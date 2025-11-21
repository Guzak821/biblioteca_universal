"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var ExternalApiService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExternalApiService = void 0;
const common_1 = require("@nestjs/common");
const LibroViewModel_1 = require("../../domain/view-model/LibroViewModel");
const mockUnamBooks = [
    {
        bookId: 'UNAM-1',
        bookTitle: 'Álgebra de Baldor',
        genre: 'Matemáticas',
        coverImage: 'https://placehold.co/50x70/0000ff/ffffff?text=UNAM',
        pdfBase64: 'BASE64_PDF_COMPLETO_UNAM_ID_1',
    },
    {
        bookId: 'UNAM-2',
        bookTitle: 'Cálculo de Stewart',
        genre: 'Matemáticas',
        coverImage: 'https://placehold.co/50x70/0000ff/ffffff?text=UNAM',
        pdfBase64: 'BASE64_PDF_COMPLETO_UNAM_ID_2',
    },
];
let ExternalApiService = ExternalApiService_1 = class ExternalApiService {
    async searchBooks(filtro) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const filtroLower = filtro.toLowerCase();
                const filteredBooks = mockUnamBooks.filter(book => book.bookTitle.toLowerCase().includes(filtroLower));
                const viewModels = filteredBooks.map(book => LibroViewModel_1.LibroViewModelMapper.mapExternalBook(book, ExternalApiService_1.UNIVERSITY_ID));
                resolve(viewModels);
            }, 300);
        });
    }
    async getBookPdf(libroId) {
        return new Promise((resolve) => {
            setTimeout(() => {
                const book = mockUnamBooks.find(b => b.bookId === libroId);
                if (book) {
                    resolve(book.pdfBase64);
                }
                else {
                    resolve(null);
                }
            }, 500);
        });
    }
};
exports.ExternalApiService = ExternalApiService;
ExternalApiService.UNIVERSITY_ID = 'UNAM';
exports.ExternalApiService = ExternalApiService = ExternalApiService_1 = __decorate([
    (0, common_1.Injectable)()
], ExternalApiService);
//# sourceMappingURL=ExternalApiService.js.map