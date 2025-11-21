import { LibroViewModel } from '../../../src/libros/domain/view-model/LibroViewModel';
export declare class ApiServiceModule {
    private static UNIVERSITY_ID;
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getBookPdf(libroId: string): Promise<string | null>;
}
