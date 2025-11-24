import { Injectable } from '@nestjs/common';
import { LibroDao } from '../libros/domain/dao/LibroDao';
import { LibroCqrs } from '../libros/aplication/mvc/LibroCqrs';
import { LibroModel, CreateLibroDto, UpdateLibroDto } from '../libros/domain/models/LibroModel';
import { LibroViewModel } from '../libros/domain/view-model/LibroViewModel';
import { UnamApiService } from '../libros/infraestucture/api-service/UnamApiService';
import { OxfordApiService } from '../libros/infraestucture/api-service/OxfordApiService';


/**
 * LibroController - Patrón MVC (Controller)
 * Lógica de negocio para gestión de libros
 * Puede usar: DAO, CQRS, ApiService (DDD), ViewModel (MVVM)
 */
@Injectable()
export class LibroController {
  constructor(
    private readonly libroDao: LibroDao,
    private readonly libroCqrs: LibroCqrs,
    private readonly unamApiService: UnamApiService,
    private readonly oxfordApiService: OxfordApiService,
  ) {}

  /**
   * Obtener todos los libros internos (para CRUD Bibliotecario)
   * Flujo: MVC > DAO
   */
  async handleGetAllInternalBooks(): Promise<LibroModel[]> {
    console.log('[LibroController] Consultando libros internos');
    return await this.libroDao.findAll();
  }

  /**
   * Obtener un libro por ID
   * Flujo: MVC > DAO
   */
  async handleGetBookById(id: number): Promise<LibroModel | null> {
    console.log(`[LibroController] Consultando libro ID: ${id}`);
    return await this.libroDao.findById(id);
  }

  /**
   * Crear nuevo libro
   * Flujo: MVC > CQRS > DAO
   */
  async handleCreateBook(dto: CreateLibroDto): Promise<LibroModel> {
    console.log(`[LibroController] Creando libro: ${dto.titulo}`);
    return await this.libroCqrs.createLibro(dto);
  }

  /**
   * Actualizar libro
   * Flujo: MVC > CQRS > DAO
   */
  async handleUpdateBook(
    id: number,
    dto: UpdateLibroDto,
  ): Promise<LibroModel | null> {
    console.log(`[LibroController] Actualizando libro ID: ${id}`);
    return await this.libroCqrs.updateLibro(id, dto);
  }

  /**
   * Eliminar libro
   * Flujo: MVC > CQRS > DAO
   */
  async handleDeleteBook(id: number): Promise<boolean> {
    console.log(`[LibroController] Eliminando libro ID: ${id}`);
    return await this.libroCqrs.deleteLibro(id);
  }

  /**
   * Búsqueda global de libros (Internos + Externos)
   * Flujo: MVC > DAO (internos) + ApiService (externos) > ViewModel
   * Implementa patrones: MVC, DDD, MVVM, DAO
   */
  async handleSearchBooks(filtro: string): Promise<LibroViewModel[]> {
    console.log(`[LibroController] Búsqueda global con filtro: "${filtro}"`);

    // 1. Consultar libros internos usando DAO
    const librosInternos = await this.libroDao.searchByFilter(filtro);
    const viewModelsInternos = LibroViewModel.fromModelArray(librosInternos);

    // 2. Consultar libros externos usando ApiService (DDD)
    const [librosUnam, librosOxford] = await Promise.all([
      this.unamApiService.searchBooks(filtro),
      this.oxfordApiService.searchBooks(filtro),
    ]);

    // 3. Unir resultados (internos + externos)
    const todosLosLibros = [
      ...viewModelsInternos,
      ...librosUnam,
      ...librosOxford,
    ];

    console.log(`[LibroController] Total de libros encontrados: ${todosLosLibros.length}`);
    return todosLosLibros;
  }

  /**
   * Obtener contenido PDF de un libro
   * Flujo: MVC > DAO (si es interno) o ApiService (si es externo) > ViewModel
   */
  async handleGetPdfContent(
    libroId: string,
    universidad: string,
    isExternal: boolean,
  ): Promise<string | null> {
    console.log(
      `[LibroController] Obteniendo PDF - ID: ${libroId}, Universidad: ${universidad}, Externo: ${isExternal}`,
    );

    if (!isExternal) {
      // Libro interno - usar DAO
      const libro = await this.libroDao.findById(Number(libroId));
      return libro ? libro.pdfBase64 : null;
    } else {
      // Libro externo - usar ApiService (DDD)
      if (universidad === 'UNAM') {
        return await this.unamApiService.getPdf(libroId);
      } else if (universidad === 'OXFORD') {
        return await this.oxfordApiService.getPdf(libroId);
      }
      return null;
    }
  }
}