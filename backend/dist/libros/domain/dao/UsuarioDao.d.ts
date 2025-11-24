import { Repository } from 'typeorm';
import { UsuarioEntity } from '../../../usuarios/usuario.entity';
import { UsuarioModel } from '../../../usuarios/UsuarioModel';
export declare class UsuarioDao {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<UsuarioEntity>);
    findByUsuario(usuario: string): Promise<UsuarioModel | null>;
    findAll(): Promise<UsuarioModel[]>;
    findById(id: number): Promise<UsuarioModel | null>;
    exists(usuario: string): Promise<boolean>;
}
