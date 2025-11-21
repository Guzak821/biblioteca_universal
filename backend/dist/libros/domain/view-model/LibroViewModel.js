"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibroViewModelMapper = void 0;
const common_1 = require("@nestjs/common");
let LibroViewModelMapper = class LibroViewModelMapper {
    static mapInternalBook(model) {
        return {
            titulo: model.titulo,
            universidad: model.universidadPropietaria,
            genero: model.generoLiterario,
            portadaBase64: model.portadaBase64,
            identificadorLibro: model.id,
            identificadorUniversidad: model.universidadPropietaria,
            isExternal: false,
        };
    }
    static mapExternalBook(externalData, universityId) {
        return {
            titulo: externalData.bookTitle,
            universidad: universityId,
            genero: externalData.genre,
            portadaBase64: externalData.coverImage,
            identificadorLibro: externalData.bookId,
            identificadorUniversidad: universityId,
            isExternal: true,
        };
    }
};
exports.LibroViewModelMapper = LibroViewModelMapper;
exports.LibroViewModelMapper = LibroViewModelMapper = __decorate([
    (0, common_1.Injectable)()
], LibroViewModelMapper);
//# sourceMappingURL=LibroViewModel.js.map