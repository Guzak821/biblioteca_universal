// backend/src/libros/domain/view-model/LibroViewModel.ts

import { LibroModel } from '../models/LibroModel';

/**
 * Modelo de Vista que representa cómo se mostrará un libro en la pantalla de búsqueda.
 * Unifica la estructura de datos para libros internos y externos.
 * [cite_start]El ViewModel debe ser llamado desde el MVC o el ApiService del DDD, pero nunca desde el CQRS o DAO[cite: 125].
 */
export interface LibroViewModel {
  // Campos de Presentación Solicitados (Serán visibles en la tabla de resultados)
  titulo: string; // El título del libro (ej: Álgebra de Baldor)
  universidad: string; // Universidad de origen (ej: UTL, UNAM)
  genero: string; // El género del libro (ej: Matemáticas)
  portadaBase64: string;
  // Imagen de la portada para mostrar en la lista [cite: 11, 49]

  // Campos de Identificación para el flujo de "Ver Libro"
  identificadorLibro: string | number; // ID único del libro en su sistema de origen
  identificadorUniversidad: string; // Identificador de la universidad de origen (clave para la consulta posterior)
  isExternal: boolean; // Indica si el libro es de la BD interna o externa
}

/**
 * Clase de Mapeo. Contiene la lógica para transformar el Modelo de BD (o datos externos)
 * [cite_start]al Modelo de Vista, sin incluir lógica de negocio, consultas o llamadas a otras clases[cite: 123, 124].
 */
export class LibroViewModelMapper {
  /**
   * Mapea un LibroModel interno (DAO) a LibroViewModel.
   * @param model El modelo de la BD interna.
   * @returns El modelo de vista.
   */
  public static mapInternalBook(model: LibroModel): LibroViewModel {
    return {
      titulo: model.titulo,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      universidad: model.universidadPropietaria,
      genero: model.generoLiterario,
      portadaBase64: model.portadaBase64,
      identificadorLibro: model.id,
      identificadorUniversidad: model.universidadPropietaria,
      isExternal: false,
    };
  }

  /**
   * Mapea un objeto de datos externos (ApiService) a LibroViewModel.
   * @param externalData El objeto JSON recibido del servicio externo.
   * @param universityId El identificador de la universidad externa.
   * @returns El modelo de vista.
   */
  public static mapExternalBook(
    externalData: any,
    universityId: string,
  ): LibroViewModel {
    // Asumiendo que 'externalData' contiene campos como bookTitle, genre, coverImage, bookId
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      titulo: externalData.bookTitle,
      universidad: universityId, // El nombre de la universidad externa
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      genero: externalData.genre,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      portadaBase64: externalData.coverImage,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      identificadorLibro: externalData.bookId,
      identificadorUniversidad: universityId,
      isExternal: true,
    };
  }
}
