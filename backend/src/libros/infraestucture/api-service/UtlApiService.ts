import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroModel } from '../../domain/models/LibroModel';
/**
 * UtlApiService - Patrón DDD (Infraestructura)
 * Simula la conexión con la API de otro compañero (UTL)
 * En tu caso, podrías omitir este si UTL es tu universidad local
 */
@Injectable()
export class UtlApiService {
  private readonly apiUrl = 'http://localhost:3003/api/libros'; // URL de otro compañero

  /**
   * Busca libros en la API de UTL externa
   */
  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    try {
      console.log(`[UtlApiService] Consultando API UTL externa con filtro: "${filtro}"`);

      const response = await fetch(`${this.apiUrl}/search?q=${encodeURIComponent(filtro)}`);
      
      if (!response.ok) {
        console.error(`[UtlApiService] Error HTTP: ${response.status}`);
        return [];
      }

      const data = await response.json();

      return data.map((libro: any) => {
        const model = new LibroModel(
          libro.id,
          libro.titulo,
          libro.genero || 'Sin categoría',
          libro.portada || '',
          libro.pdf || '',
          'UTL-EXTERNA',
        );
        return LibroViewModel.fromModel(model);
      });
    } catch (error) {
      console.error('[UtlApiService] Error al consultar API UTL:', error);
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico
   */
  async getPdf(libroId: string): Promise<string | null> {
    try {
      console.log(`[UtlApiService] Obteniendo PDF del libro ID: ${libroId}`);

      const response = await fetch(`${this.apiUrl}/${libroId}/pdf`);
      
      if (!response.ok) {
        console.error(`[UtlApiService] Error al obtener PDF: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.pdf || null;
    } catch (error) {
      console.error('[UtlApiService] Error al obtener PDF:', error);
      return null;
    }
  }
}