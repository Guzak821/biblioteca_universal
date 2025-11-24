import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
export declare class UtlApiService {
    private readonly apiUrl;
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getPdf(libroId: string): Promise<string | null>;
}
