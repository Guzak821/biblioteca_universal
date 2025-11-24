import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroModel } from '../../domain/models/LibroModel';

/**
 * UnamApiService - Patrón DDD (Infraestructura)
 * Maneja la conexión con la API externa de la UNAM
 * Separa el dominio (DAO, CQRS) de la infraestructura (APIs externas)
 */
@Injectable()
export class UnamApiService {
  private readonly apiUrl = 'http://localhost:3001/api/libros'; // URL de compañero

  /**
   * Busca libros en la API de la UNAM
   * Retorna LibroViewModel mapeados
   */
  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    try {
      console.log(`[UnamApiService] Consultando API UNAM con filtro: "${filtro}"`);

      const response = await fetch(`${this.apiUrl}?filtro=${encodeURIComponent(filtro)}`);
      
      if (!response.ok) {
        console.error(`[UnamApiService] Error HTTP: ${response.status}`);
        return [];
      }

      const data = await response.json();

      // Mapear los datos externos a LibroViewModel
      return data.map((libro: any) => {
        const model = new LibroModel(
          libro.id,
          libro.titulo,
          libro.generoLiterario || libro.genero_literario || 'Sin género',
          libro.portadaBase64 || libro.portada_base64 || '',
          libro.pdfBase64 || libro.pdf_base64 || '',
          'UNAM', // Universidad propietaria
        );
        return LibroViewModel.fromModel(model);
      });
    } catch (error) {
      console.error('[UnamApiService] Error al consultar API UNAM:', error);
      return []; // Retornar array vacío en caso de error
    }
  }

  /**
   * Obtiene el PDF de un libro específico de la UNAM
   */
  async getPdf(libroId: string): Promise<string | null> {
    try {
      console.log(`[UnamApiService] Obteniendo PDF del libro ID: ${libroId}`);

      const response = await fetch(`${this.apiUrl}/${libroId}/pdf`);
      
      if (!response.ok) {
        console.error(`[UnamApiService] Error al obtener PDF: ${response.status}`);
        return null;
      }

      const data = await response.json();
      return data.pdfBase64 || data.pdf_base64 || null;
    } catch (error) {
      console.error('[UnamApiService] Error al obtener PDF:', error);
      return null;
    }
  }
}