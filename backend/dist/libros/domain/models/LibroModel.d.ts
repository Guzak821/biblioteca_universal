export declare class LibroModel {
    id: number;
    titulo: string;
    generoLiterario: string;
    portadaBase64: string;
    pdfBase64: string;
    universidadPropietaria: string;
    constructor(id: number, titulo: string, generoLiterario: string, portadaBase64: string, pdfBase64: string, universidadPropietaria: string);
}
export declare class CreateLibroDto {
    titulo: string;
    generoLiterario: string;
    portadaBase64: string;
    pdfBase64: string;
    universidadPropietaria: string;
}
export declare class UpdateLibroDto {
    titulo?: string;
    generoLiterario?: string;
    portadaBase64?: string;
    pdfBase64?: string;
}
