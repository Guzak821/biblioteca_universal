// backend/src/libros/domain/dao/LibroDao.ts

import { LibroModel } from '../models/LibroModel';

/**
 * Simulación de los libros en la base de datos interna (ej. UTL).
 */
const mockLibrosInternos: LibroModel[] = [
  {
    id: 101,
    titulo: 'Álgebra de Baldor',
    generoLiterario: 'Matemáticas',
    portadaBase64: 'base64_portada_baldor_utl', // Simulación de portada
    pdfBase64: 'base64_pdf_baldor_utl', // Simulación del PDF completo en base64
    universidad: 'UTL',
    universidadPropietaria: '',
  },
  {
    id: 102,
    titulo: 'Introducción a la Biología',
    generoLiterario: 'Biología',
    portadaBase64: 'base64_portada_biologia_utl',
    pdfBase64: 'base64_pdf_biologia_utl',
    universidad: 'UTL',
    universidadPropietaria: '',
  },
];

/**
 * Clase que maneja todas las consultas a los datos de Libro internos.
 * El nombre del archivo incluye "Dao".
 * Solo debe contener consultas; las modificaciones (CRUD) irían en CQRS.
 */
export class LibroDao {
  findAll(): LibroModel[] {
    throw new Error('Method not implemented.');
  }
  /**
   * Consulta libros internos que coincidan con un término de búsqueda.
   * Este método será usado por el Controller para la pantalla del Alumno.
   * @param filtro El término de búsqueda ingresado por el alumno.
   * @returns Un arreglo de LibroModel.
   */
  public findLibrosByFiltro(filtro: string): LibroModel[] {
    const filtroLower = filtro.toLowerCase();

    // Simula la consulta SELECT * FROM libros WHERE titulo LIKE '%filtro%'
    const resultados = mockLibrosInternos.filter(
      (libro) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        libro.titulo.toLowerCase().includes(filtroLower) ||
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
        libro.generoLiterario.toLowerCase().includes(filtroLower),
    );

    return resultados;
  }

  /**
   * Consulta el PDF de un libro interno por su ID.
   * Este método será usado por el Controller para el flujo de "Ver Libro".
   * @param id El ID del libro interno.
   * @returns El LibroModel o null.
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  public findLibroById(id: number): LibroModel | null {
    // Simula la consulta SELECT * FROM libros WHERE id = id
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const libro = mockLibrosInternos.find((libro) => libro.id === id);
    return libro ? libro : null;
  }
}
