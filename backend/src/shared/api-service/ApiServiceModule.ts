// backend/src/libros/infrastructure/shared/api-service/UnamApiService.ts

import { LibroViewModel } from '../../../src/libros/domain/view-model/LibroViewModel';
import { LibroViewModelMapper } from '../../../src/libros/domain/view-model/LibroViewModel';

/**
 * Simulación de datos que la API de la UNAM podría retornar.
 * (Generalmente sería un JSON con una estructura diferente a tu LibroModel interno)
 */
const mockUnamBooks = [
  {
    bookId: 'UNAM-1',
    bookTitle: 'Álgebra de Baldor',
    genre: 'Matemáticas',
    coverImage: 'base64_portada_baldor_unam',
    downloadPath: '/api/unam/download/UNAM-1', // Simula una ruta para el PDF
  },
  {
    bookId: 'UNAM-2',
    bookTitle: 'Cálculo de Stewart',
    genre: 'Matemáticas',
    coverImage: 'base64_portada_stewart_unam',
    downloadPath: '/api/unam/download/UNAM-2',
  },
  {
    bookId: 'UNAM-3',
    bookTitle: 'Historia de México I',
    genre: 'Literatura',
    coverImage: 'base64_portada_historia_unam',
    downloadPath: '/api/unam/download/UNAM-3',
  },
];

/**
 * Clase de Infraestructura que maneja la comunicación con la API externa de la UNAM.
 * Implementa el patrón DDD (Dominio, Infraestructura).
 * El nombre del archivo incluye "ApiService".
 */
export class ApiServiceModule {
  private static UNIVERSITY_ID = 'UNAM';

  /**
   * Consulta libros de la biblioteca de la UNAM.
   * @param filtro El término de búsqueda del alumno.
   * @returns Una Promesa que resuelve en un arreglo de LibroViewModel.
   */
  public async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    console.log(
      `[ApiService: ${ApiServiceModule.UNIVERSITY_ID}] Buscando libros con filtro: ${filtro}`,
    );

    // Simular el retraso de una llamada de red externa
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtroLower = filtro.toLowerCase();

        // 1. Simulación de la llamada HTTP y el filtro
        const filteredBooks = mockUnamBooks.filter(
          (book) =>
            book.bookTitle.toLowerCase().includes(filtroLower) ||
            book.genre.toLowerCase().includes(filtroLower),
        );

        // 2. Mapeo al ViewModel
        // El ApiService puede implementar clases ViewModel[cite: 132].
        const viewModels = filteredBooks.map((book) =>
          // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
          LibroViewModelMapper.mapExternalBook(
            book,
            ApiServiceModule.UNIVERSITY_ID,
          ),
        );

        resolve(viewModels);
      }, 300); // Un poco más de latencia, ya que es una API externa
    });
  }

  /**
   * Simula la petición a la UNAM para obtener el PDF de un libro específico en base64.
   * @param libroId ID del libro externo.
   * @returns El PDF en base64.
   */
  public async getBookPdf(libroId: string): Promise<string | null> {
    console.log(
      `[ApiService: ${ApiServiceModule.UNIVERSITY_ID}] Solicitando PDF para ID: ${libroId}`,
    );

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular que la UNAM retorna el PDF en base64
        const book = mockUnamBooks.find((b) => b.bookId === libroId);

        if (book) {
          // Un PDF simulado en base64
          resolve(`BASE64_PDF_COMPLETO_UNAM_ID_${libroId}`);
        } else {
          resolve(null);
        }
      }, 500); // Simular mayor latencia para obtener el archivo grande
    });
  }
}
