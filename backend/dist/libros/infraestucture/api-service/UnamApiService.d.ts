import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
export declare class UnamApiService {
    private readonly apiUrl;
    private cleanBase64;
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getPdf(libroId: string | number): Promise<string | null>;
}
