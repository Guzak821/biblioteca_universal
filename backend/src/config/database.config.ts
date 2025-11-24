import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite', // Se crea automáticamente en la raíz del backend
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: true, // Crea las tablas automáticamente
  logging: true,
};