"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibroViewModel = void 0;
class LibroViewModel {
    constructor(libro, isExternal = false) {
        this.id = libro.id;
        this.titulo = libro.titulo;
        this.generoLiterario = libro.generoLiterario;
        this.portadaBase64 = libro.portadaBase64;
        this.pdfBase64 = libro.pdfBase64;
        this.universidadPropietaria = libro.universidadPropietaria;
        this.isExternal = isExternal;
    }
    static fromModel(libro, isExternal = false) {
        return new LibroViewModel(libro, isExternal);
    }
    static fromModelArray(libros, isExternal = false) {
        return libros.map((libro) => LibroViewModel.fromModel(libro, isExternal));
    }
}
exports.LibroViewModel = LibroViewModel;
//# sourceMappingURL=LibroViewModel.js.map