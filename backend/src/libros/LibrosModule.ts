import { Module } from '@nestjs/common';
import { LibrosController } from '../controller/LibroController';
import { LibrosService } from '../libros/domain/service/LibrosService';
import { LibroDao } from './domain/dao/LibroDao';
import { LibroCqrs } from './aplication/mvc/LibroCqrs';
import { ExternalApiService } from './infraestucture/api-service/ExternalApiService';
import { LibroViewModelMapper } from './domain/view-model/LibroViewModel'; // Inyectable opcional

@Module({
  imports: [],
  controllers: [LibrosController],
  providers: [
    LibrosService,
    // Proveedores de la capa de Dominio y Aplicación
    LibroDao,
    LibroCqrs,
    LibroViewModelMapper, 
    // Proveedores de la capa de Infraestructura
    ExternalApiService,
  ],
})
export class LibrosModule {}