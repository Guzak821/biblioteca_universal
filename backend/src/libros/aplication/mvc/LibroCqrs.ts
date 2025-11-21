import { LibroDao } from '../../../libros/domain/dao/LibroDao';
import { LibroModel } from '../../../libros/domain/models/LibroModel';
import { Injectable } from '@nestjs/common';

/**
 * Clase que maneja los COMANDOS (modificaciones) para el Dominio de Libros.
 * Flujo: SERVICE/CONTROLLER -> CQRS -> DAO
 */
@Injectable() // Usar @Injectable para inyección de dependencia en NestJS
export class LibroCqrs {
  private libroDao: LibroDao;

  constructor() {
    this.libroDao = new LibroDao();
  }

  public registerBook(book: Omit<LibroModel, 'id'>): LibroModel {
    return this.libroDao.save(book);
  }

  public editBook(book: LibroModel): LibroModel | null {
    return this.libroDao.update(book);
  }

  public deleteBook(id: number): boolean {
    return this.libroDao.delete(id);
  }
}