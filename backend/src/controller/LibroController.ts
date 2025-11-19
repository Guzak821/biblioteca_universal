// backend/src/libros/controller/LibroController.ts

import { LibroDao } from '../libros/domain/dao/LibroDao';
// Importamos los ApiServices (Infraestructura/DDD)
import { ApiServiceModule } from '../shared/api-service/ApiServiceModule';
// Importamos los Modelos (Dominio y ViewModel)
import { LibroModel } from '../libros/domain/models/LibroModel';
import { LibroViewModel } from '../libros/domain/view-model/LibroViewModel';
import { LibroViewModelMapper } from '../libros/domain/view-model/LibroViewModel';

export class LibroController {
  private libroDao: LibroDao;
  private ApiServiceModule: ApiServiceModule;
  // Puedes inicializar otros ApiServices aquí (ej: oxfordApiService)

  constructor() {
    // Inicialización de componentes de Dominio (DAO) e Infraestructura (ApiService)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.libroDao = new LibroDao();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
    this.ApiServiceModule = new ApiServiceModule();
  }

  /**
   * 📚 BÚSQUEDA GLOBAL DE LIBROS (Para el Alumno)
   * Coordinación de MVC -> (DAO + DDD/ApiService) -> MVVM
   * @param filtro El campo de texto de filtro.
   * @returns Una Promesa que resuelve en un arreglo unificado de LibroViewModel.
   */
  public async handleSearchBooks(filtro: string): Promise<LibroViewModel[]> {
    console.log(`[Controller] Iniciando búsqueda global para: ${filtro}`);

    // 1. Consultar Libros Internos (DAO) [cite: 59]
    // El controlador utiliza el DAO para la consulta de los libros internos.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const internalBooks = this.libroDao.findLibrosByFiltro(filtro);

    // 2. Consultar Libros Externos (DDD/ApiService) [cite: 60]
    // El controlador utiliza el llamado a la clase ApiService (DDD).
    const externalPromises = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      this.ApiServiceModule.searchBooks(filtro),
      // Añadir aquí llamadas a otros ApiServices (ej: oxfordApiService.searchBooks(filtro))
    ];

    // Esperamos a que todas las APIs externas respondan en paralelo
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const [unamBooks] = await Promise.all(externalPromises);

    // 3. Mapear y Unificar (MVVM) [cite: 59, 60, 61]

    // Mapear libros internos al ViewModel: mapeando al ViewModel [cite: 59]
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const internalViewModels: LibroViewModel[] = internalBooks.map(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      (libro: any) => LibroViewModelMapper.mapInternalBook(libro),
    );

    // Los resultados externos (unamBooks) ya vienen en formato ViewModel desde el ApiService.
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const externalViewModels: LibroViewModel[] = unamBooks;

    // En el controlador se unen los resultados [cite: 61]
    const allBooks: LibroViewModel[] = [
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...internalViewModels,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      ...externalViewModels,
    ];

    return allBooks;
  }

  /**
   * 📄 VISUALIZAR PDF DE LIBRO (Para el Alumno)
   * Flujo de patrones: MVC -> (DAO o DDD/ApiService) -> Retorno de Base64
   * @param libroId Identificador del libro en su sistema de origen.
   * @param universidadId Identificador de la universidad propietaria.
   * @param isExternal Bandera para saber si buscar en DAO o API.
   * @returns Una Promesa que resuelve en el PDF del libro en base64.
   */
  public async handleGetPdf(
    libroId: string,
    universidadId: string,
    isExternal: boolean,
  ): Promise<string | null> {
    // El controlador recibe la petición con el identificador de la universidad y el identificador del libro (MVC) [cite: 83]

    let pdfBase64: string | null = null;

    // Desde el controlador se realiza el uso del DAO para consultar si el libro es interno o externo[cite: 84].
    if (isExternal) {
      // Si es externo, se utiliza el llamado a la clase ApiService (DDD) [cite: 86]
      if (universidadId === 'UNAM') {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        pdfBase64 = await this.ApiServiceModule.getBookPdf(libroId);
      }
      // Se puede añadir lógica para otras universidades externas aquí

      // Si es externo y se encuentra, mapearlo y retornar el PDF [cite: 86]
    } else {
      // Si es interno, se realiza el uso del DAO para consultar [cite: 85]
      // Convertimos el ID a número para el DAO interno
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const internalBook = this.libroDao.findLibroById(Number(libroId));
      if (internalBook) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
        pdfBase64 = internalBook.pdfBase64;
      }
      // Si es interno y se encuentra, mapearlo y retornar el PDF [cite: 85]
    }

    if (pdfBase64) {
      return pdfBase64;
    }

    return null;
  }

  // --- MÉTODOS DE ADMIN (CRUD DE LIBROS INTERNOS) ---

  /**
   * Consulta libros internos (Para el CRUD del Bibliotecario).
   * Flujo: MVC -> DAO -> Modelo
   */
  public findAllInternalBooks(): LibroModel[] {
    // Usa el DAO directamente, sin mapear a ViewModel
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    return this.libroDao.findAll(); // Asume que agregaste un findAll en LibroDao
  }

  // Aquí irían:
  // - handleRegisterBook (MVC -> CQRS -> DAO)
  // - handleEditBook (MVC -> CQRS -> DAO)
}
