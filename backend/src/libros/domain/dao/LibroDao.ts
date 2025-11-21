import { LibroModel } from '../models/LibroModel';

/**
 * Simulación de los libros en la base de datos interna (UTL).
 * (Datos mock para simular la BD)
 */
const mockLibrosInternos: LibroModel[] = [
  {
    id: 101,
    titulo: 'Álgebra de Baldor',
    generoLiterario: 'Matemáticas',
    portadaBase64: 'https://placehold.co/50x70/087990/ffffff?text=PORTADA_B',
    pdfBase64: 'BASE64_PDF_COMPLETO_UTL_BALDOR', // Mock de PDF
    universidadPropietaria: 'UTL',
    universidad: ''
  },
  {
    id: 102,
    titulo: 'Introducción a la Biología',
    generoLiterario: 'Biología',
    portadaBase64: 'https://placehold.co/50x70/000000/ffffff?text=PORTADA_B',
    pdfBase64: 'BASE64_PDF_COMPLETO_UTL_BIO',
    universidadPropietaria: 'UTL',
    universidad: ''
  },
];

/**
 * Clase que maneja todas las consultas y modificaciones a los datos de Libro internos.
 * ÚNICO lugar donde debe haber lógica de consultas/persistencia a datos.
 */
export class LibroDao {
  
  public findAll(): LibroModel[] {
    return mockLibrosInternos;
  }
  
  public findLibrosByFiltro(filtro: string): LibroModel[] {
    const filtroLower = filtro.toLowerCase();
    
    return mockLibrosInternos.filter(libro =>
      libro.titulo.toLowerCase().includes(filtroLower) || 
      libro.generoLiterario.toLowerCase().includes(filtroLower)
    );
  }

  public findLibroById(id: number): LibroModel | null {
    const libro = mockLibrosInternos.find(libro => libro.id === id);
    return libro ? libro : null;
  }

  // --- MÉTODOS DE MODIFICACIÓN (Usados por CQRS) ---

  public save(book: Omit<LibroModel, 'id'>): LibroModel {
    const newId = Math.floor(Math.random() * 1000) + 200;
    const newBook: LibroModel = { id: newId, ...book };
    mockLibrosInternos.push(newBook);
    return newBook;
  }

  public update(book: LibroModel): LibroModel | null {
    const index = mockLibrosInternos.findIndex((b) => b.id === book.id);
    if (index !== -1) {
      mockLibrosInternos[index] = book;
      return mockLibrosInternos[index];
    }
    return null;
  }

  public delete(id: number): boolean {
    const index = mockLibrosInternos.findIndex((b) => b.id === id);
    if (index !== -1) {
      mockLibrosInternos.splice(index, 1);
      return true;
    }
    return false;
  }
}