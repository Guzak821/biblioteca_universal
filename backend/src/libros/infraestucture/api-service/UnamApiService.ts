import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroModel } from '../../domain/models/LibroModel';

/**
 * UnamApiService - Patrón DDD (Infraestructura)
 * Maneja la conexión con la API externa de la UNAM
 * CORREGIDO: Filtrado mejorado y manejo robusto de IDs
 */
@Injectable()
export class UnamApiService {
  private readonly apiUrl = 'http://192.168.137.87:3000/libros';

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
   * MEJORADO: Filtrado más flexible
   */
  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    try {
      console.log(`[UnamApiService] 🔍 Consultando API UNAM con filtro: "${filtro}"`);

      // Timeout de 30 segundos (aumentado para APIs lentas)
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      // La API de UNAM espera el parámetro "filtro"
      const url = `${this.apiUrl}${filtro ? `?filtro=${encodeURIComponent(filtro)}` : ''}`;
      console.log(`[UnamApiService] URL completa: ${url}`);
      console.log(`[UnamApiService] ⏱️ Esperando respuesta (timeout: 30s)...`);

      const startTime = Date.now();

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      const elapsedTime = Date.now() - startTime;
      console.log(`[UnamApiService] ✓ Respuesta recibida en ${elapsedTime}ms`);
      
      if (!response.ok) {
        console.error(`[UnamApiService] ❌ Error HTTP: ${response.status}`);
        return [];
      }

      const responseData = await response.json();
      
      // La respuesta viene en { success: true, data: [...] }
      const librosArray = responseData.data || [];

      console.log(`[UnamApiService] ✓ Libros recibidos de la API: ${librosArray.length}`);

      if (librosArray.length > 0) {
        console.log(`[UnamApiService] 📖 Primer libro (muestra):`, {
          idLibro: librosArray[0].idLibro,
          titulo: librosArray[0].titulo,
          descripcion: librosArray[0].descripcion
        });
      }

      // Mapear libros
      const mappedBooks = librosArray.map((libro: any) => {
        const portada = libro.portadaUrl || '';
        const pdf = libro.pdfUrl || '';

        console.log(`[UnamApiService] Mapeando: "${libro.titulo}" | ID: ${libro.idLibro}`);

        const model = new LibroModel(
          libro.idLibro,              // ID como viene de la API
          libro.titulo,               // Título
          libro.descripcion || 'Sin género', // Descripción/Género
          portada,                    // Portada CON prefijo Data URI
          pdf,                        // PDF CON prefijo Data URI
          libro.universidad || 'UNAM', // Universidad
        );
        return LibroViewModel.fromModel(model, true); // true = ES externo
      });

      console.log(`[UnamApiService] ✓ Libros mapeados exitosamente: ${mappedBooks.length}`);
      
      // FILTRADO LOCAL: Si la API no filtra correctamente, hacerlo aquí
      if (filtro && filtro.trim() !== '') {
        const filtroLower = filtro.toLowerCase().trim();
        
        const librosFiltrados = mappedBooks.filter((libro) => {
          const tituloMatch = libro.titulo.toLowerCase().includes(filtroLower);
          const generoMatch = libro.generoLiterario.toLowerCase().includes(filtroLower);
          
          return tituloMatch || generoMatch;
        });

        console.log(`[UnamApiService] 🔍 Filtrado local aplicado: ${librosFiltrados.length} de ${mappedBooks.length} libros coinciden con "${filtro}"`);
        
        return librosFiltrados;
      }
      
      return mappedBooks;
    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[UnamApiService] ⏱️ TIMEOUT - La petición tardó más de 30 segundos');
        console.error('[UnamApiService] ❌ La API de UNAM no responde. Verifica:');
        console.error('[UnamApiService]    1. ¿La API está corriendo en http://192.168.137.109:3000?');
        console.error('[UnamApiService]    2. ¿Hay problemas de red/firewall?');
        console.error('[UnamApiService]    3. ¿La API está sobrecargada?');
      } else {
        console.error('[UnamApiService] ❌ Error al consultar API UNAM:', error.message);
        console.error('[UnamApiService] Stack:', error.stack);
      }
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico de la UNAM
   * CORREGIDO: Maneja IDs como string o number
   */
  async getPdf(libroId: string | number): Promise<string | null> {
    try {
      // Convertir el ID a string (la API usa strings como "UNAM-11")
      const idString = String(libroId);
      
      console.log(`[UnamApiService] Obteniendo PDF del libro`);
      console.log(`[UnamApiService] ID recibido: ${libroId} (tipo: ${typeof libroId})`);
      console.log(`[UnamApiService] ID convertido a string: "${idString}"`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 seg para PDF

      // Obtener todos los libros
      const response = await fetch(this.apiUrl, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`[UnamApiService] ❌ Error HTTP: ${response.status}`);
        return null;
      }

      const responseData = await response.json();
      const librosArray = responseData.data || [];
      
      console.log(`[UnamApiService] 🔍 Buscando libro en ${librosArray.length} registros...`);
      console.log(`[UnamApiService] Buscando ID: "${idString}"`);
      
      // Buscar el libro por idLibro (comparación flexible)
      const libro = librosArray.find((l: any) => {
        // Comparar como strings para evitar problemas de tipo
        return String(l.idLibro) === idString;
      });

      if (!libro) {
        console.error(`[UnamApiService] ❌ Libro no encontrado con ID: ${idString}`);
        console.log(`[UnamApiService] IDs disponibles (primeros 10):`);
        librosArray.slice(0, 10).forEach((l: any, index: number) => {
          console.log(`  ${index + 1}. "${l.idLibro}" (tipo: ${typeof l.idLibro}) - ${l.titulo}`);
        });
        return null;
      }

      console.log(`[UnamApiService] ✓ Libro encontrado: "${libro.titulo}"`);
      console.log(`[UnamApiService] Estructura del libro:`, {
        idLibro: libro.idLibro,
        titulo: libro.titulo,
        tienePdfUrl: !!libro.pdfUrl,
        longitudPdfUrl: libro.pdfUrl?.length || 0
      });

      // El PDF puede venir con prefijo data:application/pdf;base64, o sin él
      const pdfDataUri = libro.pdfUrl;

      if (!pdfDataUri) {
        console.error('[UnamApiService] ❌ El libro no tiene pdfUrl');
        console.log('[UnamApiService] Campos disponibles:', Object.keys(libro));
        return null;
      }

      console.log(`[UnamApiService] ✓ PDF encontrado - Longitud: ${pdfDataUri.length} caracteres`);
      console.log(`[UnamApiService] Primeros 100 chars del PDF: ${pdfDataUri.substring(0, 100)}`);

      // Limpiar el base64
      let cleanedBase64 = pdfDataUri;

      // Si viene con prefijo Data URI, extraerlo
      if (cleanedBase64.includes('base64,')) {
        const parts = cleanedBase64.split('base64,');
        if (parts.length === 2) {
          cleanedBase64 = parts[1];
          console.log('[UnamApiService] ✓ Removido prefijo Data URI');
        }
      } else if (cleanedBase64.startsWith('data:')) {
        const commaIndex = cleanedBase64.indexOf(',');
        if (commaIndex !== -1) {
          cleanedBase64 = cleanedBase64.substring(commaIndex + 1);
          console.log('[UnamApiService] ✓ Removido prefijo Data URI (método alternativo)');
        }
      }

      // Remover espacios, saltos de línea, etc.
      cleanedBase64 = cleanedBase64.replace(/\s/g, '');

      console.log(`[UnamApiService] ✓ Base64 limpio - Longitud: ${cleanedBase64.length} caracteres`);
      console.log(`[UnamApiService] Primeros 50 chars limpios: ${cleanedBase64.substring(0, 50)}`);
      console.log(`[UnamApiService] Últimos 50 chars limpios: ${cleanedBase64.substring(cleanedBase64.length - 50)}`);

      // Validar que no esté vacío
      if (cleanedBase64.length < 100) {
        console.error(`[UnamApiService] ❌ Base64 muy corto: ${cleanedBase64.length} caracteres`);
        return null;
      }

      // Validar formato base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleanedBase64)) {
        console.error('[UnamApiService] ❌ Base64 contiene caracteres inválidos');
        return null;
      }

      console.log('[UnamApiService] ✓✓✓ PDF validado y listo para retornar');
      return cleanedBase64;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[UnamApiService] ⏱️ Timeout al obtener PDF (15 segundos)');
      } else {
        console.error('[UnamApiService] ❌ Error al obtener PDF:', error.message);
        console.error('[UnamApiService] Stack:', error.stack);
      }
      return null;
    }
  }
}