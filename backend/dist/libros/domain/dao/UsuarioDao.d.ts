import { UsuarioModel } from '../models/UsuarioModel';
export declare const mockUsuarios: UsuarioModel[];
export declare class UsuarioDao {
    findByUsuario(usuario: string): UsuarioModel | null;
    findAll(): UsuarioModel[];
    findById(id: number): UsuarioModel | null;
}
