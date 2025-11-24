import { OnModuleInit } from '@nestjs/common';
import { LibroEntity } from '../libros/LibroEntity';
import { Repository } from 'typeorm';
export declare class LibrosModule implements OnModuleInit {
    private readonly libroRepository;
    constructor(libroRepository: Repository<LibroEntity>);
    onModuleInit(): Promise<void>;
}
