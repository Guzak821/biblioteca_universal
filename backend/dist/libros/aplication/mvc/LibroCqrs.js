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
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibroCqrs = void 0;
const LibroDao_1 = require("../../../libros/domain/dao/LibroDao");
const common_1 = require("@nestjs/common");
let LibroCqrs = class LibroCqrs {
    constructor() {
        this.libroDao = new LibroDao_1.LibroDao();
    }
    registerBook(book) {
        return this.libroDao.save(book);
    }
    editBook(book) {
        return this.libroDao.update(book);
    }
    deleteBook(id) {
        return this.libroDao.delete(id);
    }
};
exports.LibroCqrs = LibroCqrs;
exports.LibroCqrs = LibroCqrs = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], LibroCqrs);
//# sourceMappingURL=LibroCqrs.js.map