import { LibrosService } from '../libros/domain/service/LibrosService';
import { LibroModel } from '../libros/domain/models/LibroModel';
import { LibroViewModel } from '../libros/domain/view-model/LibroViewModel';
interface CreateBookDto extends Omit<LibroModel, 'id'> {
}
interface UpdateBookDto extends LibroModel {
}
export declare class LibrosController {
    private readonly librosService;
    constructor(librosService: LibrosService);
    searchBooks(filtro: string): Promise<LibroViewModel[]>;
    getPdf(id: string, universidad: string, external: string): Promise<{
        pdfBase64: string;
    }>;
    findAllAdmin(): LibroModel[];
    create(createBookDto: CreateBookDto): LibroModel;
    update(id: string, updateBookDto: UpdateBookDto): LibroModel;
    remove(id: string): {
        message: string;
    };
}
export {};
