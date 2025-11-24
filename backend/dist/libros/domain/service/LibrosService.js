"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibrosService = void 0;
const common_1 = require("@nestjs/common");
const LibroDao_1 = require("../dao/LibroDao");
const LibroCqrs_1 = require("../../aplication/mvc/LibroCqrs");
const LibroViewModel_1 = require("../view-model/LibroViewModel");
const UnamApiService_1 = require("../../infraestucture/api-service/UnamApiService");
let LibrosService = class LibrosService {
    constructor(libroDao, libroCqrs, externalApiService) {
        this.libroDao = libroDao;
        this.libroCqrs = libroCqrs;
        this.externalApiService = externalApiService;
    }
    findAllInternalBooks() {
        return this.libroDao.findAll();
    }
    registerBook(book) {
        return this.libroCqrs.registerBook(book);
    }
    editBook(book) {
        return this.libroCqrs.editBook(book);
    }
    deleteBook(id) {
        return this.libroCqrs.deleteBook(id);
    }
    async searchBooks(filtro) {
        const internalBooks = this.libroDao.findLibrosByFiltro(filtro);
        const internalViewModels = internalBooks.map(LibroViewModel_1.LibroViewModelMapper.mapInternalBook);
        const externalPromises = [
            this.externalApiService.searchBooks(filtro),
        ];
        const externalResultsArray = await Promise.all(externalPromises);
        const externalViewModels = externalResultsArray.flat();
        return [...internalViewModels, ...externalViewModels];
    }
    async getPdfContent(libroId, universidadId, isExternal) {
        if (isExternal) {
            if (universidadId === UnamApiService_1.ExternalApiService.UNIVERSITY_ID) {
                return this.externalApiService.getBookPdf(libroId);
            }
            return null;
        }
        else {
            const internalBook = this.libroDao.findLibroById(Number(libroId));
            return internalBook ? internalBook.pdfBase64 : null;
        }
    }
};
exports.LibrosService = LibrosService;
exports.LibrosService = LibrosService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [LibroDao_1.LibroDao,
        LibroCqrs_1.LibroCqrs, typeof (_a = typeof UnamApiService_1.ExternalApiService !== "undefined" && UnamApiService_1.ExternalApiService) === "function" ? _a : Object])
], LibrosService);
//# sourceMappingURL=LibrosService.js.map