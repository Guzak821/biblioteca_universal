import { Repository } from 'typeorm';
import { LibroEntity } from '../../LibroEntity';
import { LibroModel, CreateLibroDto, UpdateLibroDto } from '../../domain/models/LibroModel';
import { LibroDao } from '../../domain/dao/LibroDao';
export declare class LibroCqrs {
    private readonly libroRepository;
    private readonly libroDao;
    constructor(libroRepository: Repository<LibroEntity>, libroDao: LibroDao);
    createLibro(dto: CreateLibroDto): Promise<LibroModel>;
    updateLibro(id: number, dto: UpdateLibroDto): Promise<LibroModel | null>;
    deleteLibro(id: number): Promise<boolean>;
}
