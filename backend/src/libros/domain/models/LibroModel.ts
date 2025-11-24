/**
 * LibroModel - Modelo de dominio
 * Usado por DAO y CQRS (Modelo original de la BD)
 */
export class LibroModel {
  id: number;
  titulo: string;
  generoLiterario: string;
  portadaBase64: string;
  pdfBase64: string;
  universidadPropietaria: string;

  constructor(
    id: number,
    titulo: string,
    generoLiterario: string,
    portadaBase64: string,
    pdfBase64: string,
    universidadPropietaria: string,
  ) {
    this.id = id;
    this.titulo = titulo;
    this.generoLiterario = generoLiterario;
    this.portadaBase64 = portadaBase64;
    this.pdfBase64 = pdfBase64;
    this.universidadPropietaria = universidadPropietaria;
  }
}

/**
 * DTOs para crear y actualizar
 */
export class CreateLibroDto {
  titulo: string;
  generoLiterario: string;
  portadaBase64: string;
  pdfBase64: string;
  universidadPropietaria: string;
}

export class UpdateLibroDto {
  titulo?: string;
  generoLiterario?: string;
  portadaBase64?: string;
  pdfBase64?: string;
}