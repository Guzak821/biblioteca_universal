import { UsuarioController } from '../controller/UsuarioController';
import { CreateUsuarioDto, UpdateUsuarioDto } from './UsuarioModel';
export declare class UsuariosController {
    private readonly usuarioController;
    constructor(usuarioController: UsuarioController);
    findAll(): Promise<{
        id: number;
        usuario: string;
        rol: "Bibliotecario" | "Alumno";
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        usuario: string;
        rol: "Bibliotecario" | "Alumno";
    }>;
    create(dto: CreateUsuarioDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            usuario: string;
            rol: "Bibliotecario" | "Alumno";
        };
    }>;
    update(id: number, dto: UpdateUsuarioDto): Promise<{
        success: boolean;
        message: string;
        data: {
            id: number;
            usuario: string;
            rol: "Bibliotecario" | "Alumno";
        };
    }>;
    remove(id: number): Promise<{
        success: boolean;
        message: string;
    }>;
}
