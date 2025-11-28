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
   * Función auxiliar para limpiar base64 CON o SIN prefijo Data URI
   */
  private cleanBase64(base64String: string | null, keepDataUri: boolean = false): string | null {
    if (!base64String) return null;

    try {
      let cleaned = base64String;
      
      // Si queremos mantener el Data URI (para PDFs que ya lo tienen)
      if (keepDataUri && cleaned.startsWith('data:')) {
        return cleaned; // Retornar tal cual
      }

      // Remover prefijo data: si existe y NO queremos mantenerlo
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
   * Estructura de respuesta: { success: true, data: [...] }
   */
  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    try {
      console.log(`[UnamApiService] Consultando API UNAM con filtro: "${filtro}"`);
      console.log(`[UnamApiService] URL completa: ${this.apiUrl}?filtro=${encodeURIComponent(filtro)}`);

      // Timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.apiUrl}?filtro=${encodeURIComponent(filtro)}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`[UnamApiService] Error HTTP: ${response.status}`);
        return [];
      }

      const responseData = await response.json();
      
      console.log(`[UnamApiService] Estructura de respuesta:`, {
        success: responseData.success,
        tieneData: !!responseData.data,
        esArray: Array.isArray(responseData.data),
        cantidad: responseData.data?.length || 0
      });

      // La respuesta viene en { success: true, data: [...] }
      const librosArray = responseData.data || [];

      if (!Array.isArray(librosArray)) {
        console.error('[UnamApiService] data no es un array');
        return [];
      }

      console.log(`[UnamApiService] Cantidad de libros: ${librosArray.length}`);

      if (librosArray.length > 0) {
        console.log(`[UnamApiService] Primer libro (muestra):`, {
          idLibro: librosArray[0].idLibro,
          titulo: librosArray[0].titulo,
          universidad: librosArray[0].universidad,
          tienePortada: !!librosArray[0].portadaUrl,
          tienePdf: !!librosArray[0].pdfUrl
        });
      }

      // Mapear los datos externos a LibroViewModel
      const mappedBooks = librosArray.map((libro: any) => {
        console.log(`[UnamApiService] Mapeando libro: ${libro.titulo} (ID: ${libro.idLibro})`);

        // La portada ya viene con prefijo data:image/png;base64,
        const portada = libro.portadaUrl || '';
        
        // El PDF ya viene con prefijo data:application/pdf;base64,
        // Lo guardamos pero NO lo necesitamos para la lista (solo para visualizar)
        const pdf = libro.pdfUrl || '';

        const model = new LibroModel(
          libro.idLibro,                               // ID del libro
          libro.titulo,                                 // Título
          libro.descripcion || 'Sin género',            // Descripción/Género
          portada,                                      // Portada CON prefijo Data URI
          pdf,                                          // PDF CON prefijo Data URI (para getPdf)
          libro.universidad || 'UNAM',                  // Universidad
        );
        return LibroViewModel.fromModel(model, true); // true = ES externo
      });

      console.log(`[UnamApiService] Libros mapeados exitosamente: ${mappedBooks.length}`);
      
      return mappedBooks;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[UnamApiService] Timeout - La petición tardó más de 10 segundos');
      } else {
        console.error('[UnamApiService] Error al consultar API UNAM:', error.message);
        console.error('[UnamApiService] Stack:', error.stack);
      }
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico de la UNAM
   * Los PDFs ya vienen con el prefijo data:application/pdf;base64,
   */
  async getPdf(libroId: string): Promise<string | null> {
    try {
      console.log(`[UnamApiService] Obteniendo PDF del libro ID: ${libroId}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seg para PDF

      const response = await fetch(this.apiUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`[UnamApiService] Error HTTP: ${response.status}`);
        return null;
      }

      const responseData = await response.json();
      const librosArray = responseData.data || [];
      
      // Buscar el libro por idLibro
      const libro = librosArray.find((l: any) => l.idLibro === libroId);

      if (!libro) {
        console.error('[UnamApiService] Libro no encontrado');
        return null;
      }

      // El PDF ya viene con prefijo data:application/pdf;base64,
      const pdfDataUri = libro.pdfUrl;

      if (!pdfDataUri) {
        console.error('[UnamApiService] El libro no tiene pdfUrl');
        return null;
      }

      // Extraer solo el base64 (sin el prefijo data:application/pdf;base64,)
      const cleanedBase64 = this.cleanBase64(pdfDataUri, false);

      if (cleanedBase64) {
        console.log(`[UnamApiService] PDF limpio - Tamaño: ${cleanedBase64.length} caracteres`);
        console.log(`[UnamApiService] Primeros 50 chars: ${cleanedBase64.substring(0, 50)}`);
      } else {
        console.error('[UnamApiService] No se pudo limpiar el base64');
      }

      return cleanedBase64;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[UnamApiService] Timeout al obtener PDF');
      } else {
        console.error('[UnamApiService] Error al obtener PDF:', error.message);
      }
      return null;
    }
  }
}