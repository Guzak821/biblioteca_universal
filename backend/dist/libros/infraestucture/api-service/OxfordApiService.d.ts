import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
export declare class OxfordApiService {
    private readonly apiUrl;
    private uuidMap;
    private uuidToNumericId;
    private numericIdToUuid;
    private extractUUID;
    private cleanBase64;
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getPdf(bookId: string | number): Promise<string | null>;
    private processPdfFromBook;
}
