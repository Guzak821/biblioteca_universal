import { LibroModel } from '../models/LibroModel';
export declare class LibroViewModel {
    id: number;
    titulo: string;
    generoLiterario: string;
    portadaBase64: string;
    pdfBase64: string;
    universidadPropietaria: string;
    isExternal: boolean;
    constructor(libro: LibroModel, isExternal?: boolean);
    static fromModel(libro: LibroModel, isExternal?: boolean): LibroViewModel;
    static fromModelArray(libros: LibroModel[], isExternal?: boolean): LibroViewModel[];
}
