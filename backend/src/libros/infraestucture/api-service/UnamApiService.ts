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
  private readonly apiUrl = 'http://192.168.137.206:3000/libros'; // URL de compañero

  /**
   * Función auxiliar para limpiar base64
   */
  private cleanBase64(base64String: string | null): string | null {
    if (!base64String) return null;

    try {
      let cleaned = base64String;
      
      // Remover prefijo data: si existe
      if (cleaned.startsWith('data:')) {
        cleaned = cleaned.split(',')[1];
      }

      // Remover espacios, saltos de línea, tabulaciones
      cleaned = cleaned.replace(/\s/g, '');

      // Validar que sea base64 válido
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleaned)) {
        console.error('[UnamApiService] Base64 inválido');
        return null;
      }

      return cleaned;
    } catch (error) {
      console.error('[UnamApiService] Error al limpiar base64:', error);
      return null;
    }
  }

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
          'UNAM', 
        );
        return LibroViewModel.fromModel(model, true); // true = ES externo
      });
    } catch (error) {
      console.error('[UnamApiService] Error al consultar API UNAM:', error);
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico de la UNAM
   * MEJORADO: Limpia el base64 antes de retornarlo
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
      
      // Obtener el base64 del PDF
      const pdfBase64 = data.pdfBase64 || data.pdf_base64 || null;

      if (!pdfBase64) {
        console.error('[UnamApiService] No se encontró el PDF en la respuesta');
        return null;
      }

      // Limpiar y validar el base64
      const cleanedBase64 = this.cleanBase64(pdfBase64);

      if (cleanedBase64) {
        console.log(`[UnamApiService] PDF limpio - Tamaño: ${cleanedBase64.length} caracteres`);
        console.log(`[UnamApiService] Primeros 50 chars: ${cleanedBase64.substring(0, 50)}`);
        console.log(`[UnamApiService] Últimos 50 chars: ${cleanedBase64.substring(cleanedBase64.length - 50)}`);
      } else {
        console.error('[UnamApiService] El base64 no es válido después de limpiarlo');
      }

      return cleanedBase64;

    } catch (error) {
      console.error('[UnamApiService] Error al obtener PDF:', error);
      return null;
    }
  }
}