"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLibroDto = exports.CreateLibroDto = exports.LibroModel = void 0;
class LibroModel {
    constructor(id, titulo, generoLiterario, portadaBase64, pdfBase64, universidadPropietaria) {
        this.id = id;
        this.titulo = titulo;
        this.generoLiterario = generoLiterario;
        this.portadaBase64 = portadaBase64;
        this.pdfBase64 = pdfBase64;
        this.universidadPropietaria = universidadPropietaria;
    }
}
exports.LibroModel = LibroModel;
class CreateLibroDto {
}
exports.CreateLibroDto = CreateLibroDto;
class UpdateLibroDto {
}
exports.UpdateLibroDto = UpdateLibroDto;
//# sourceMappingURL=LibroModel.js.map