"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibroViewModel = void 0;
class LibroViewModel {
    constructor(libro) {
        this.id = libro.id;
        this.titulo = libro.titulo;
        this.generoLiterario = libro.generoLiterario;
        this.portadaBase64 = libro.portadaBase64;
        this.universidadPropietaria = libro.universidadPropietaria;
    }
    static fromModel(libro) {
        return new LibroViewModel(libro);
    }
    static fromModelArray(libros) {
        return libros.map((libro) => LibroViewModel.fromModel(libro));
    }
}
exports.LibroViewModel = LibroViewModel;
//# sourceMappingURL=LibroViewModel.js.map