import { Repository } from 'typeorm';
import { LibroEntity } from '../../LibroEntity';
import { LibroModel } from '../models/LibroModel';
export declare class LibroDao {
    private readonly libroRepository;
    constructor(libroRepository: Repository<LibroEntity>);
    findAll(): Promise<LibroModel[]>;
    findById(id: number): Promise<LibroModel | null>;
    searchByFilter(filtro: string): Promise<LibroModel[]>;
    existsByTitulo(titulo: string): Promise<boolean>;
}
