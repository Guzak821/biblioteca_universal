import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroModel } from '../../domain/models/LibroModel';

/**
 * OxfordApiService - Patrón DDD (Infraestructura)
 * Maneja la conexión con la API externa de Oxford
 */ 
@Injectable()
export class OxfordApiService {
  private readonly apiUrl = 'http://192.168.137.1:8079/Cambridge/biblioteca/libro/getAllLibro'; // URL de otro compañero

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
        console.error('[OxfordApiService] Base64 inválido');
        return null;
      }

      return cleaned;
    } catch (error) {
      console.error('[OxfordApiService] Error al limpiar base64:', error);
      return null;
    }
  }

  /**
   * Función auxiliar para convertir URL de PDF a base64
   */
  private async convertPdfUrlToBase64(pdfUrl: string): Promise<string | null> {
    try {
      console.log(`[OxfordApiService] Descargando PDF desde: ${pdfUrl}`);

      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        console.error(`[OxfordApiService] Error al descargar PDF: ${response.status}`);
        return null;
      }

      // Obtener el PDF como buffer
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      // Convertir a base64
      const base64 = buffer.toString('base64');
      
      console.log(`[OxfordApiService] PDF convertido a base64 - Tamaño: ${base64.length} caracteres`);
      
      return this.cleanBase64(base64);
    } catch (error) {
      console.error('[OxfordApiService] Error al convertir PDF a base64:', error);
      return null;
    }
  }

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
      
      console.log(`[OxfordApiService] Cantidad de libros recibidos: ${data.length}`);

      // Mapear los datos externos a LibroViewModel
      return data.map((book: any) => {
        // Limpiar el base64 de la portada si viene
        let cleanBookCover = book.bookCover || '';
        
        // Si la portada viene en base64, limpiarla
        if (cleanBookCover && !cleanBookCover.startsWith('http')) {
          // Asegurar que tenga el prefijo data: para imágenes
          if (!cleanBookCover.startsWith('data:')) {
            cleanBookCover = `data:image/jpeg;base64,${cleanBookCover}`;
          }
        }

        console.log(`[OxfordApiService] Mapeando libro: ${book.bookTitle} - UUID: ${book.uuid}`);

        const model = new LibroModel(
          book.uuid,                           // UUID
          book.bookTitle,                      // Título
          book.genre || 'Unknown',             // Género
          cleanBookCover,                      // Portada en base64 (limpia)
          book.pdfUrl || '',                   // URL del PDF
          'OXFORD',                            // Universidad
        );

        return LibroViewModel.fromModel(model, true);
      });

    } catch (error) {
      console.error('[OxfordApiService] Error al consultar API Oxford:', error);
      return [];
    }
  }

  /**
   * Obtiene el PDF de un libro específico de Oxford
   * MEJORADO: Convierte la URL del PDF a base64
   */
  async getPdf(bookId: string): Promise<string | null> {
    try {
      console.log(`[OxfordApiService] Obteniendo PDF del libro ID: ${bookId}`);

      // 1. Obtener todos los libros
      const response = await fetch(this.apiUrl);
      
      if (!response.ok) {
        console.error(`[OxfordApiService] Error HTTP: ${response.status}`);
        return null;
      }

      const data = await response.json();

      // 2. Buscar el libro por UUID
      const book = data.find((b: any) => b.uuid === bookId);

      if (!book) {
        console.error("[OxfordApiService] Libro no encontrado");
        return null;
      }

      // 3. Si tiene pdfUrl, convertirlo a base64
      if (book.pdfUrl) {
        console.log(`[OxfordApiService] Convirtiendo PDF de URL a base64...`);
        return await this.convertPdfUrlToBase64(book.pdfUrl);
      }

      console.error("[OxfordApiService] El libro no tiene pdfUrl");
      return null;

    } catch (error) {
      console.error("[OxfordApiService] Error al obtener PDF:", error);
      return null;
    }
  }
}