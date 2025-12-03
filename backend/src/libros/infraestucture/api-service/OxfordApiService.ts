import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroModel } from '../../domain/models/LibroModel';

/**
 * OxfordApiService - Patrón DDD (Infraestructura)
 * Maneja la conexión con la API externa de Oxford (Cambridge)
 * CORREGIDO: Maneja IDs con prefijo "Cambridge-" + Filtrado Local
 */ 
@Injectable()
export class OxfordApiService {
  private readonly apiUrl = 'http://192.168.137.1:8079/Cambridge/biblioteca/libro/getAllLibro';

  /**
   * Mapa para mantener la relación ID numérico ↔ UUID
   * Esto permite convertir entre ambos formatos
   */
  private uuidMap: Map<number, string> = new Map();

  /**
   * Convierte un UUID a un ID numérico único y consistente
   * Guarda la relación en el mapa para poder hacer la conversión inversa
   */
  private uuidToNumericId(uuid: string): number {
    // Primero verificar si ya existe en el mapa (búsqueda inversa)
    for (const [id, storedUuid] of this.uuidMap.entries()) {
      if (storedUuid === uuid) {
        return id;
      }
    }

    // Generar un hash numérico del UUID
    let hash = 0;
    for (let i = 0; i < uuid.length; i++) {
      const char = uuid.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convertir a entero de 32 bits
    }
    
    // Asegurar que sea positivo
    const numericId = Math.abs(hash);
    
    // Guardar en el mapa
    this.uuidMap.set(numericId, uuid);
    
    console.log(`[OxfordApiService] 🔑 Mapeando: ${numericId} → ${uuid}`);
    
    return numericId;
  }

  /**
   * Convierte un ID numérico de vuelta a UUID
   * Si no existe en el mapa, asume que el ID es el UUID en formato string
   */
  private numericIdToUuid(id: number | string): string {
    // Si ya es string, retornarlo (puede ser UUID directo)
    if (typeof id === 'string') {
      return this.extractUUID(id);
    }
    
    // Buscar en el mapa
    const uuid = this.uuidMap.get(id);
    if (uuid) {
      return uuid;
    }
    
    // Si no está en el mapa, convertir el número a string y tratar de extraer UUID
    return this.extractUUID(id.toString());
  }

  /**
   * Función auxiliar para extraer el UUID real del ID
   * Si viene "Cambridge-194478b5-cb22-11f0-97dd-c0185046f654"
   * Retorna "194478b5-cb22-11f0-97dd-c0185046f654"
   */
  private extractUUID(id: string): string {
    if (id.startsWith('Cambridge-')) {
      return id.replace('Cambridge-', '');
    }
    return id;
  }

  /**
   * Función auxiliar para limpiar base64
   */
  private cleanBase64(base64String: string | null): string | null {
    if (!base64String) {
      console.log('[OxfordApiService] ⚠️ Base64 string vacío o null');
      return null;
    }

    try {
      let cleaned = base64String.trim();
      
      console.log(`[OxfordApiService] Base64 original - Longitud: ${cleaned.length}`);
      console.log(`[OxfordApiService] Primeros 100 chars originales: ${cleaned.substring(0, 100)}`);
      
      // Remover prefijo Data URI si existe
      if (cleaned.includes('base64,')) {
        const parts = cleaned.split('base64,');
        if (parts.length === 2) {
          cleaned = parts[1];
          console.log('[OxfordApiService] ✓ Removido prefijo Data URI (método 1)');
        }
      } else if (cleaned.startsWith('data:')) {
        const commaIndex = cleaned.indexOf(',');
        if (commaIndex !== -1) {
          cleaned = cleaned.substring(commaIndex + 1);
          console.log('[OxfordApiService] ✓ Removido prefijo Data URI (método 2)');
        }
      }

      // Remover espacios, saltos de línea, tabulaciones
      cleaned = cleaned.replace(/\s/g, '');

      // Validar formato base64
      const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
      if (!base64Regex.test(cleaned)) {
        console.error('[OxfordApiService] ❌ Base64 inválido - contiene caracteres no permitidos');
        console.error('[OxfordApiService] Primeros 200 chars: ', cleaned.substring(0, 200));
        return null;
      }

      // Validar longitud mínima
      if (cleaned.length < 100) {
        console.error(`[OxfordApiService] ❌ Base64 muy corto: ${cleaned.length} caracteres`);
        return null;
      }

      console.log(`[OxfordApiService] ✓ Base64 limpio - Longitud: ${cleaned.length} caracteres`);
      console.log(`[OxfordApiService] Primeros 50 chars limpios: ${cleaned.substring(0, 50)}`);
      console.log(`[OxfordApiService] Últimos 50 chars limpios: ${cleaned.substring(cleaned.length - 50)}`);
      
      return cleaned;
    } catch (error) {
      console.error('[OxfordApiService] ❌ Error al limpiar base64:', error);
      return null;
    }
  }

  /**
   * Busca libros en la API de Oxford
   * CORREGIDO: Ahora incluye filtrado local
   */
  async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    try {
      console.log(`[OxfordApiService] 🔍 Consultando API Oxford con filtro: "${filtro}"`);

      // Timeout de 10 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`${this.apiUrl}?search=${encodeURIComponent(filtro)}`, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`[OxfordApiService] ❌ Error HTTP: ${response.status}`);
        return [];
      }

      const data = await response.json();
      
      // Verificar si data es array directamente o viene en estructura { data: [] }
      const librosArray = Array.isArray(data) ? data : (data.data || []);
      
      console.log(`[OxfordApiService] ✓ Cantidad de libros recibidos: ${librosArray.length}`);

      if (librosArray.length > 0) {
        console.log(`[OxfordApiService] 📖 Primer libro (muestra):`, {
          uuid: librosArray[0].uuid,
          bookTitle: librosArray[0].bookTitle,
          tienePortada: !!librosArray[0].bookCover,
          tienePdfUrl: !!librosArray[0].pdfUrl,
          tienePdfBase64: !!librosArray[0].pdfBase64
        });
      }

      // Mapear los datos externos a LibroViewModel
      let mappedBooks = librosArray.map((book: any) => {
        // Limpiar portada
        let cleanBookCover = book.bookCover || '';
        
        if (cleanBookCover && !cleanBookCover.startsWith('http')) {
          if (!cleanBookCover.startsWith('data:')) {
            cleanBookCover = `data:image/jpeg;base64,${cleanBookCover}`;
          }
        }

        console.log(`[OxfordApiService] 📚 Mapeando libro: ${book.bookTitle} - UUID: ${book.uuid}`);

        // IMPORTANTE: Convertir UUID a número hash para compatibilidad
        const hashId = this.uuidToNumericId(book.uuid);
        console.log(`[OxfordApiService] UUID: ${book.uuid} → ID numérico: ${hashId}`);
        
        // Guardar el PDF
        let pdfData = book.pdfBase64 || book.pdfUrl || '';

        // CRÍTICO: Guardar "Cambridge" como universidad propietaria
        const model = new LibroModel(
          hashId,                              // ID NUMÉRICO
          book.bookTitle,                      // Título
          book.genre || 'Unknown',             // Género
          cleanBookCover,                      // Portada en base64
          pdfData,                             // PDF (puede ser URL o base64)
          'Cambridge',                         // Universidad (nombre de la API externa)
        );

        return LibroViewModel.fromModel(model, true);
      });

      console.log(`[OxfordApiService] ✓ Libros mapeados exitosamente: ${mappedBooks.length}`);

      // ============================================
      // FILTRADO LOCAL CRÍTICO
      // ============================================
      if (filtro && filtro.trim() !== '') {
        const filtroLower = filtro.toLowerCase().trim();
        
        mappedBooks = mappedBooks.filter((libro) => {
          const tituloMatch = libro.titulo.toLowerCase().includes(filtroLower);
          const generoMatch = libro.generoLiterario.toLowerCase().includes(filtroLower);
          
          return tituloMatch || generoMatch;
        });

        console.log(`[OxfordApiService] 🔍 Filtrado local aplicado: ${mappedBooks.length} libros coinciden con "${filtro}"`);
      } 
     // else {
      //  console.log(`[OxfordApiService] ℹ️ Sin filtro - Retornando todos los ${mappedBooks.length} libros`);
     // }

      return mappedBooks;

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[OxfordApiService] ⏱️ Timeout - La petición tardó más de 10 segundos');
      } else {
        console.error('[OxfordApiService] ❌ Error al consultar API Oxford:', error.message);
      }
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico de Oxford
   * CORREGIDO: Extrae el UUID real del ID con prefijo
   */
  async getPdf(bookId: string | number): Promise<string | null> {
    try {
      console.log(`[OxfordApiService] 📥 getPdf llamado con ID:`, bookId, `(tipo: ${typeof bookId})`);
      
      let realUUID: string;
      
      // Convertir el bookId a número si es string numérico
      const numericBookId = typeof bookId === 'number' ? bookId : parseInt(bookId);
      
      if (!isNaN(numericBookId)) {
        // Es un ID numérico, buscar en el mapa
        const mappedUuid = this.uuidMap.get(numericBookId);
        
        if (mappedUuid) {
          realUUID = mappedUuid;
          console.log(`[OxfordApiService] ✓ ID numérico ${numericBookId} encontrado en mapa → UUID: ${realUUID}`);
        } else {
          console.error(`[OxfordApiService] ❌ ID numérico ${numericBookId} NO encontrado en mapa`);
          console.log(`[OxfordApiService] 📋 Mapa actual tiene ${this.uuidMap.size} entradas`);
          
          // Mostrar las primeras 5 entradas del mapa para debugging
          let count = 0;
          for (const [id, uuid] of this.uuidMap.entries()) {
            if (count < 5) {
              console.log(`  ${id} → ${uuid}`);
              count++;
            }
          }
          
          return null;
        }
      } else {
        // No es numérico, intentar extraer UUID si tiene prefijo
        realUUID = this.extractUUID(bookId.toString());
        console.log(`[OxfordApiService] ✓ String ID → UUID: ${realUUID}`);
      }

      // Timeout de 15 segundos para PDF
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      // 1. Obtener todos los libros
      const response = await fetch(this.apiUrl, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.error(`[OxfordApiService] ❌ Error HTTP: ${response.status}`);
        return null;
      }

      const data = await response.json();
      
      // Verificar estructura de respuesta
      const librosArray = Array.isArray(data) ? data : (data.data || []);

      console.log(`[OxfordApiService] 🔍 Buscando libro en ${librosArray.length} registros...`);
      console.log(`[OxfordApiService] Buscando UUID: "${realUUID}"`);

      // 2. Buscar el libro por UUID (sin prefijo)
      const book = librosArray.find((b: any) => b.uuid === realUUID);

      if (!book) {
        console.error(`[OxfordApiService] ❌ Libro no encontrado con UUID: ${realUUID}`);
        console.log(`[OxfordApiService] 📋 UUIDs disponibles en la respuesta (primeros 10):`);
        librosArray.slice(0, 10).forEach((b: any, index: number) => {
          console.log(`  ${index + 1}. "${b.uuid}" - ${b.bookTitle}`);
        });
        console.log(`[OxfordApiService] 🔍 Intentando búsqueda case-insensitive...`);
        
        // Intento alternativo: búsqueda sin importar mayúsculas/minúsculas
        const bookAlt = librosArray.find((b: any) => 
          b.uuid.toLowerCase() === realUUID.toLowerCase()
        );
        
        if (bookAlt) {
          console.log(`[OxfordApiService] ✓ Libro encontrado con búsqueda case-insensitive: ${bookAlt.bookTitle}`);
          return await this.processPdfFromBook(bookAlt);
        }
        
        return null;
      }

      console.log(`[OxfordApiService] ✓ Libro encontrado: ${book.bookTitle}`);
      
      return await this.processPdfFromBook(book);

    } catch (error) {
      if (error.name === 'AbortError') {
        console.error('[OxfordApiService] ⏱️ Timeout al obtener PDF (15 segundos)');
      } else {
        console.error('[OxfordApiService] ❌ Error al obtener PDF:', error.message);
        console.error('[OxfordApiService] Stack:', error.stack);
      }
      return null;
    }
  }

  /**
   * Procesa el PDF desde un objeto book
   * Extrae y limpia el base64
   */
  private async processPdfFromBook(book: any): Promise<string | null> {
    try {
      console.log(`[OxfordApiService] 📋 Procesando PDF del libro: ${book.bookTitle}`);
      console.log(`[OxfordApiService] 📋 Estructura del libro:`, {
        uuid: book.uuid,
        tienePdfUrl: !!book.pdfUrl,
        tienePdfBase64: !!book.pdfBase64,
        tienePdf: !!book.pdf,
        tipoPdfUrl: typeof book.pdfUrl,
        longitudPdfUrl: book.pdfUrl?.length || 0,
        longitudPdfBase64: book.pdfBase64?.length || 0
      });

      // Intentar obtener el PDF de diferentes campos
      let pdfData = book.pdfBase64 || book.pdfUrl || book.pdf || '';

      if (!pdfData) {
        console.error('[OxfordApiService] ❌ El libro no tiene datos PDF en ningún campo');
        console.log('[OxfordApiService] Campos del libro disponibles:', Object.keys(book));
        return null;
      }

      console.log(`[OxfordApiService] ✓ PDF encontrado - Longitud: ${pdfData.length} caracteres`);
      console.log(`[OxfordApiService] Primeros 150 chars del PDF: ${pdfData.substring(0, 150)}`);
      console.log(`[OxfordApiService] El PDF empieza con: ${pdfData.startsWith('http') ? 'URL' : pdfData.startsWith('data:') ? 'Data URI' : 'Base64 puro'}`);

      // Si pdfData parece ser una URL (empieza con http), intentar descargar
      if (pdfData.startsWith('http://') || pdfData.startsWith('https://')) {
        console.log(`[OxfordApiService] 🌐 PDF es una URL, intentando descargar: ${pdfData}`);
        
        try {
          const pdfResponse = await fetch(pdfData);
          if (!pdfResponse.ok) {
            console.error(`[OxfordApiService] ❌ Error al descargar PDF: ${pdfResponse.status}`);
            return null;
          }

          const arrayBuffer = await pdfResponse.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          pdfData = buffer.toString('base64');
          
          console.log(`[OxfordApiService] ✓ PDF descargado y convertido - Tamaño: ${pdfData.length} caracteres`);
        } catch (downloadError) {
          console.error('[OxfordApiService] ❌ Error al descargar PDF desde URL:', downloadError);
          return null;
        }
      }

      // Limpiar el base64
      console.log(`[OxfordApiService] 🧹 Limpiando base64...`);
      const cleanedBase64 = this.cleanBase64(pdfData);

      if (!cleanedBase64) {
        console.error('[OxfordApiService] ❌ No se pudo limpiar el base64');
        return null;
      }

      console.log('[OxfordApiService] ✓✓✓ PDF validado y listo para retornar');
      return cleanedBase64;
    } catch (error) {
      console.error('[OxfordApiService] ❌ Error al procesar PDF del libro:', error);
      return null;
    }
  }
}