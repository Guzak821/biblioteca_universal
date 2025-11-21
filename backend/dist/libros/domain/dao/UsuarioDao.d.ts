import { UsuarioModel } from '../models/UsuarioModel';
export declare class UsuarioDao {
    findByUserAndPassword(usuario: string, contrasena: string): UsuarioModel | null;
    findAll(): UsuarioModel[];
    save(user: Omit<UsuarioModel, 'id'>): UsuarioModel;
    update(user: UsuarioModel): UsuarioModel | null;
    delete(id: number): boolean;
}
