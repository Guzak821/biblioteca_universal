"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LibroDao = void 0;
const mockLibrosInternos = [
    {
        id: 101,
        titulo: 'Álgebra de Baldor',
        generoLiterario: 'Matemáticas',
        portadaBase64: 'https://placehold.co/50x70/087990/ffffff?text=PORTADA_B',
        pdfBase64: 'BASE64_PDF_COMPLETO_UTL_BALDOR',
        universidadPropietaria: 'UTL',
        universidad: ''
    },
    {
        id: 102,
        titulo: 'Introducción a la Biología',
        generoLiterario: 'Biología',
        portadaBase64: 'https://placehold.co/50x70/000000/ffffff?text=PORTADA_B',
        pdfBase64: 'BASE64_PDF_COMPLETO_UTL_BIO',
        universidadPropietaria: 'UTL',
        universidad: ''
    },
];
class LibroDao {
    findAll() {
        return mockLibrosInternos;
    }
    findLibrosByFiltro(filtro) {
        const filtroLower = filtro.toLowerCase();
        return mockLibrosInternos.filter(libro => libro.titulo.toLowerCase().includes(filtroLower) ||
            libro.generoLiterario.toLowerCase().includes(filtroLower));
    }
    findLibroById(id) {
        const libro = mockLibrosInternos.find(libro => libro.id === id);
        return libro ? libro : null;
    }
    save(book) {
        const newId = Math.floor(Math.random() * 1000) + 200;
        const newBook = { id: newId, ...book };
        mockLibrosInternos.push(newBook);
        return newBook;
    }
    update(book) {
        const index = mockLibrosInternos.findIndex((b) => b.id === book.id);
        if (index !== -1) {
            mockLibrosInternos[index] = book;
            return mockLibrosInternos[index];
        }
        return null;
    }
    delete(id) {
        const index = mockLibrosInternos.findIndex((b) => b.id === id);
        if (index !== -1) {
            mockLibrosInternos.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.LibroDao = LibroDao;
//# sourceMappingURL=LibroDao.js.map