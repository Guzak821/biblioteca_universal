import { Injectable } from '@nestjs/common';
import { LibroViewModel } from '../../domain/view-model/LibroViewModel';
import { LibroViewModelMapper } from '../../domain/view-model/LibroViewModel';


/**
 * Simulación de datos que la API de la UNAM podría retornar.
 */
const mockUnamBooks = [
  {
    bookId: 'UNAM-1',
    bookTitle: 'Álgebra de Baldor',
    genre: 'Matemáticas',
    coverImage: 'https://placehold.co/50x70/0000ff/ffffff?text=UNAM',
    pdfBase64: 'BASE64_PDF_COMPLETO_UNAM_ID_1', 
  },
  {
    bookId: 'UNAM-2',
    bookTitle: 'Cálculo de Stewart',
    genre: 'Matemáticas',
    coverImage: 'https://placehold.co/50x70/0000ff/ffffff?text=UNAM',
    pdfBase64: 'BASE64_PDF_COMPLETO_UNAM_ID_2',
  },
];

@Injectable()
export class ExternalApiService {
  public static readonly UNIVERSITY_ID = 'UNAM';

  public async searchBooks(filtro: string): Promise<LibroViewModel[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const filtroLower = filtro.toLowerCase();

        const filteredBooks = mockUnamBooks.filter(book =>
          book.bookTitle.toLowerCase().includes(filtroLower)
        );

        // Mapeo al ViewModel
        const viewModels = filteredBooks.map(book => 
          LibroViewModelMapper.mapExternalBook(book, ExternalApiService.UNIVERSITY_ID)
        );

        resolve(viewModels);
      }, 300); 
    });
  }

  public async getBookPdf(libroId: string): Promise<string | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const book = mockUnamBooks.find(b => b.bookId === libroId);
        
        if (book) {
            resolve(book.pdfBase64); 
        } else {
            resolve(null);
        }
      }, 500);
    });
  }
}