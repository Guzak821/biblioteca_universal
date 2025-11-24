import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { LibroEntity } from '../libros/LibroEntity';
import { UsuarioEntity } from '../usuarios/usuario.entity';


export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite', // Se crea automáticamente en la raíz del backend
  entities: [__dirname + '/../**/*.entity{.ts,.js}', LibroEntity, UsuarioEntity],
  synchronize: true, // Crea las tablas automáticamente
  logging: true,
};