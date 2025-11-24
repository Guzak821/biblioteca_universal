import { Repository } from 'typeorm';
import { UsuarioEntity } from '../../../usuarios/usuario.entity';
import { UsuarioModel, CreateUsuarioDto, UpdateUsuarioDto } from '../../../usuarios/UsuarioModel';
import { UsuarioDao } from '../../../libros/domain/dao/UsuarioDao';
export declare class UsuarioCqrs {
    private readonly usuarioRepository;
    private readonly usuarioDao;
    constructor(usuarioRepository: Repository<UsuarioEntity>, usuarioDao: UsuarioDao);
    createUsuario(dto: CreateUsuarioDto): Promise<UsuarioModel>;
    updateUsuario(id: number, dto: UpdateUsuarioDto): Promise<UsuarioModel | null>;
    deleteUsuario(id: number): Promise<boolean>;
}
