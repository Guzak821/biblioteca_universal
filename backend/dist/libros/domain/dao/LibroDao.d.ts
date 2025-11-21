import { LibroModel } from '../models/LibroModel';
export declare class LibroDao {
    findAll(): LibroModel[];
    findLibrosByFiltro(filtro: string): LibroModel[];
    findLibroById(id: number): LibroModel | null;
    save(book: Omit<LibroModel, 'id'>): LibroModel;
    update(book: LibroModel): LibroModel | null;
    delete(id: number): boolean;
}
