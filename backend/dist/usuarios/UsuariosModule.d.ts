import { OnModuleInit } from '@nestjs/common';
import { UsuarioEntity } from './usuario.entity';
import { Repository } from 'typeorm';
export declare class UsuariosModule implements OnModuleInit {
    private readonly usuarioRepository;
    constructor(usuarioRepository: Repository<UsuarioEntity>);
    onModuleInit(): Promise<void>;
}
