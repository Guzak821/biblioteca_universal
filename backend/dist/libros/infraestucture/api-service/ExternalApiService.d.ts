import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
export declare class ExternalApiService {
    static readonly UNIVERSITY_ID = "UNAM";
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getBookPdf(libroId: string): Promise<string | null>;
}
