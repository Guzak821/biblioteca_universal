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
   * Función auxiliar para limpiar y validar base64
   */
  private cleanBase64(base64String: string | null): string | null {
    if (!base64String) return null;

    try {
      // Remover el prefijo data: si existe
      let cleaned = base64String;
      if (cleaned.startsWith('data:')) {
        cleaned = cleaned.split(',')[1];
      }

      // Remover espacios en blanco, saltos de línea, tabulaciones
      cleaned = cleaned.replace(/\s/g, '');

      // Validar que sea base64 válido (solo caracteres A-Z, a-z, 0-9, +, /, =)
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleaned)) {
        console.error('[LibroController] Base64 inválido detectado');
        return null;
      }

      // Validar longitud mínima
      if (cleaned.length < 100) {
        console.error('[LibroController] Base64 demasiado corto');
        return null;
      }

      return cleaned;
    } catch (error) {
      console.error('[LibroController] Error al limpiar base64:', error);
      return null;
    }
  }

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
    const viewModelsInternos = LibroViewModel.fromModelArray(librosInternos, false); // false = NO es externo

    // 2. Consultar libros externos usando ApiService (DDD)
    const [librosUnam, librosOxford] = await Promise.all([
      this.unamApiService.searchBooks(filtro),
      this.oxfordApiService.searchBooks(filtro),
    ]);

    // 3. Marcar los libros externos con isExternal = true
    const librosUnamMapped = librosUnam.map(libro => ({ ...libro, isExternal: true })); 
    const librosOxfordMapped = librosOxford.map(libro => ({ ...libro, isExternal: true })); 

    // 4. Unir resultados (internos + externos)
    const todosLosLibros = [
      ...viewModelsInternos,
      ...librosUnamMapped,
      ...librosOxfordMapped,
    ];

    console.log(`[LibroController] Total de libros encontrados: ${todosLosLibros.length}`);
    return todosLosLibros;
  }

  /**
   * Obtener contenido PDF de un libro
   * Flujo: MVC > DAO (si es interno) o ApiService (si es externo) > ViewModel
   * MEJORADO: Limpia y valida el base64 antes de retornarlo
   */
  async handleGetPdfContent(
    libroId: string,
    universidad: string,
    isExternal: boolean,
  ): Promise<string | null> {
    console.log(
      `[LibroController] Obteniendo PDF - ID: ${libroId}, Universidad: ${universidad}, Externo: ${isExternal}`,
    );

    let pdfBase64: string | null = null;

    try {
      if (!isExternal) {
        // Libro interno - usar DAO
        const libro = await this.libroDao.findById(Number(libroId));
        pdfBase64 = libro ? libro.pdfBase64 : null;
      } else {
        // Libro externo - usar ApiService (DDD)
        if (universidad === 'UNAM') {
          console.log('[LibroController] Obteniendo PDF de UNAM...');
          pdfBase64 = await this.unamApiService.getPdf(libroId);
        } else if (universidad === 'OXFORD') {
          console.log('[LibroController] Obteniendo PDF de OXFORD...');
          pdfBase64 = await this.oxfordApiService.getPdf(libroId);
        }
      }

      // IMPORTANTE: Limpiar el base64 antes de retornarlo
      const cleanedBase64 = this.cleanBase64(pdfBase64);

      if (cleanedBase64) {
        console.log(`[LibroController] PDF limpio - Longitud: ${cleanedBase64.length} caracteres`);
        console.log(`[LibroController] Primeros 50 chars: ${cleanedBase64.substring(0, 50)}`);
        console.log(`[LibroController] Últimos 50 chars: ${cleanedBase64.substring(cleanedBase64.length - 50)}`);
      } else {
        console.error('[LibroController] No se pudo limpiar el base64 o está vacío');
      }

      return cleanedBase64;

    } catch (error) {
      console.error('[LibroController] Error al obtener PDF:', error);
      throw error;
    }
  }
}