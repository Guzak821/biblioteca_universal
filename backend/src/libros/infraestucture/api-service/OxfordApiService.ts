import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroModel } from '../../domain/models/LibroModel';

/**
 * OxfordApiService - Patrón DDD (Infraestructura)
 * Maneja la conexión con la API externa de Oxford
 */
@Injectable()
export class OxfordApiService {
  private readonly apiUrl = 'http://localhost:3002/api/books'; // URL de otro compañero

  /**
   * Busca libros en la API de Oxford
   */
  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    try {
      console.log(`[OxfordApiService] Consultando API Oxford con filtro: "${filtro}"`);

      const response = await fetch(`${this.apiUrl}?search=${encodeURIComponent(filtro)}`);
      
      if (!response.ok) {
        console.error(`[OxfordApiService] Error HTTP: ${response.status}`);
        return [];
      }

      const data = await response.json();

      // Mapear los datos externos a LibroViewModel
      return data.map((book: any) => {
        const model = new LibroModel(
          book.id,
          book.title || book.titulo,
          book.genre || book.genero || 'Unknown',
          book.cover || book.portada || '',
          book.pdf || book.pdfBase64 || '',
          'OXFORD',
        );
        return LibroViewModel.fromModel(model);
      });
    } catch (error) {
      console.error('[OxfordApiService] Error al consultar API Oxford:', error);
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico de Oxford
   */
  async getPdf(bookId: string): Promise<string | null> {
    try {
      console.log(`[OxfordApiService] Obteniendo PDF del libro ID: ${bookId}`);

      const response = await fetch(`${this.apiUrl}/${bookId}/pdf`);
      
      if (!response.ok) {
        console.error(`[OxfordApiService] Error al obtener PDF: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.pdf || data.pdfBase64 || null;
    } catch (error) {
      console.error('[OxfordApiService] Error al obtener PDF:', error);
      return null;
    }
  }
}