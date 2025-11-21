import { LibroDao } from '../dao/LibroDao';
import { LibroCqrs } from '../../aplication/mvc/LibroCqrs';
import { LibroModel } from '../models/LibroModel';
import { LibroViewModel } from '../view-model/LibroViewModel';
import { ExternalApiService } from '../../infraestucture/api-service/ExternalApiService';
export declare class LibrosService {
    private readonly libroDao;
    private readonly libroCqrs;
    private readonly externalApiService;
    constructor(libroDao: LibroDao, libroCqrs: LibroCqrs, externalApiService: ExternalApiService);
    findAllInternalBooks(): LibroModel[];
    registerBook(book: Omit<LibroModel, 'id'>): LibroModel;
    editBook(book: LibroModel): LibroModel | null;
    deleteBook(id: number): boolean;
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getPdfContent(libroId: string, universidadId: string, isExternal: boolean): Promise<string | null>;
}
