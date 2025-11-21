import { LibroModel } from '../../../libros/domain/models/LibroModel';
export declare class LibroCqrs {
    private libroDao;
    constructor();
    registerBook(book: Omit<LibroModel, 'id'>): LibroModel;
    editBook(book: LibroModel): LibroModel | null;
    deleteBook(id: number): boolean;
}
