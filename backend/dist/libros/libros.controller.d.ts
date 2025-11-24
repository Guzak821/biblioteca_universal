import { LibroController } from '@app/controller/LibroController';
import { CreateLibroDto, UpdateLibroDto } from '../libros/domain/models/LibroModel';
export declare class LibrosController {
    private readonly libroController;
    constructor(libroController: LibroController);
    findAll(): Promise<{
        id: number;
        titulo: string;
        generoLiterario: string;
        portadaBase64: string;
        universidadPropietaria: string;
        pdfBase64: string;
    }[]>;
    search(filtro: string): Promise<import("./domain/view-model/LibroViewModel").LibroViewModel[]>;
    findOne(id: number): Promise<import("../libros/domain/models/LibroModel").LibroModel>;
    create(dto: CreateLibroDto): Promise<{
        success: boolean;
        message: string;
        data: import("../libros/domain/models/LibroModel").LibroModel;
    }>;
    update(id: number, dto: UpdateLibroDto): Promise<{
        success: boolean;
        message: string;
        data: import("../libros/domain/models/LibroModel").LibroModel;
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
    getPdf(id: string, universidad: string, external: string): Promise<{
        pdfBase64: string;
    }>;
}
