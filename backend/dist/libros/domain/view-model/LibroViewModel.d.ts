import { LibroModel } from '../models/LibroModel';
export interface LibroViewModel {
    titulo: string;
    universidad: string;
    genero: string;
    portadaBase64: string;
    identificadorLibro: string | number;
    identificadorUniversidad: string;
    isExternal: boolean;
}
export declare class LibroViewModelMapper {
    static mapInternalBook(model: LibroModel): LibroViewModel;
    static mapExternalBook(externalData: any, universityId: string): LibroViewModel;
}
