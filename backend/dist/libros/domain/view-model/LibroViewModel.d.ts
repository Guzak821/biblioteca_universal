import { LibroModel } from '../models/LibroModel';
export declare class LibroViewModel {
    id: number;
    titulo: string;
    generoLiterario: string;
    portadaBase64: string;
    universidadPropietaria: string;
    constructor(libro: LibroModel);
    static fromModel(libro: LibroModel): LibroViewModel;
    static fromModelArray(libros: LibroModel[]): LibroViewModel[];
}
