import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
export declare class OxfordApiService {
    private readonly apiUrl;
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getPdf(bookId: string): Promise<string | null>;
}
