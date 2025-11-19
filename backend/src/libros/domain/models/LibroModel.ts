// backend/src/libros/domain/models/LibroModel.ts

/**
 * Modelo que representa un libro en la BD INTERNA.
 * Se usa para las operaciones internas (DAO y CQRS).
 * Debe contener los campos solicitados: titulo, genero literario, portada y pdf.
 */
export interface LibroModel {
  universidadPropietaria: string;
  id: number; // Identificador único interno
  titulo: string; // Título del libro
  generoLiterario: string; // Género literario
  portadaBase64: string; // Imagen de portada en base64 (o ruta/URL)
  pdfBase64: string; // Contenido del PDF en base64 (o ruta/URL)
  universidad: string; // Campo para identificar la fuente (Ej: 'UTL')
}
