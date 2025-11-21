import { Injectable } from '@nestjs/common';
import { LibroDao } from '../dao/LibroDao';
import { LibroCqrs } from '../../aplication/mvc/LibroCqrs';
import { LibroModel } from '../models/LibroModel';
import { LibroViewModel } from '../view-model/LibroViewModel';
import { LibroViewModelMapper } from '../view-model/LibroViewModel';
import { ExternalApiService } from '../../infraestucture/api-service/ExternalApiService';

@Injectable()
export class LibrosService {
  // Inyección de dependencias de la lógica pura (DAO, CQRS) y la infraestructura (ApiService)
  constructor(
    private readonly libroDao: LibroDao,
    private readonly libroCqrs: LibroCqrs,
    private readonly externalApiService: ExternalApiService,
  ) {}

  // --- CRUD Admin (Solo Libros Internos) ---
  
  findAllInternalBooks(): LibroModel[] {
    return this.libroDao.findAll(); // MVC -> DAO
  }

  registerBook(book: Omit<LibroModel, 'id'>): LibroModel {
    return this.libroCqrs.registerBook(book); // MVC -> CQRS -> DAO
  }

  editBook(book: LibroModel): LibroModel | null {
    return this.libroCqrs.editBook(book); // MVC -> CQRS -> DAO
  }

  deleteBook(id: number): boolean {
    return this.libroCqrs.deleteBook(id); // MVC -> CQRS -> DAO
  }

  // --- Buscador Global (Alumno) ---

  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    // 1. Consultar Internos (DAO) y Mapear a ViewModel
    const internalBooks = this.libroDao.findLibrosByFiltro(filtro);
    const internalViewModels = internalBooks.map(LibroViewModelMapper.mapInternalBook);

    // 2. Consultar Externos (DDD/ApiService)
    const externalPromises = [
        this.externalApiService.searchBooks(filtro),
        // ... otras APIs
    ];
    
    const externalResultsArray = await Promise.all(externalPromises); 
    const externalViewModels = externalResultsArray.flat();
    
    // 3. Unificar y retornar
    return [...internalViewModels, ...externalViewModels];
  }

  async getPdfContent(libroId: string, universidadId: string, isExternal: boolean): Promise<string | null> {
    if (isExternal) {
        if (universidadId === ExternalApiService.UNIVERSITY_ID) {
            return this.externalApiService.getBookPdf(libroId); // DDD/ApiService
        }
        return null; 
    } else {
        const internalBook = this.libroDao.findLibroById(Number(libroId)); // DAO
        return internalBook ? internalBook.pdfBase64 : null;
    }
  }
}