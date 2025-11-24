import { LibroDao } from '../libros/domain/dao/LibroDao';
import { LibroCqrs } from '../libros/aplication/mvc/LibroCqrs';
import { LibroModel, CreateLibroDto, UpdateLibroDto } from '../libros/domain/models/LibroModel';
import { LibroViewModel } from '../libros/domain/view-model/LibroViewModel';
import { UnamApiService } from '../libros/infraestucture/api-service/UnamApiService';
import { OxfordApiService } from '../libros/infraestucture/api-service/OxfordApiService';
export declare class LibroController {
    private readonly libroDao;
    private readonly libroCqrs;
    private readonly unamApiService;
    private readonly oxfordApiService;
    constructor(libroDao: LibroDao, libroCqrs: LibroCqrs, unamApiService: UnamApiService, oxfordApiService: OxfordApiService);
    handleGetAllInternalBooks(): Promise<LibroModel[]>;
    handleGetBookById(id: number): Promise<LibroModel | null>;
    handleCreateBook(dto: CreateLibroDto): Promise<LibroModel>;
    handleUpdateBook(id: number, dto: UpdateLibroDto): Promise<LibroModel | null>;
    handleDeleteBook(id: number): Promise<boolean>;
    handleSearchBooks(filtro: string): Promise<LibroViewModel[]>;
    handleGetPdfContent(libroId: string, universidad: string, isExternal: boolean): Promise<string | null>;
}
