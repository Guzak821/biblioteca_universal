import { LibroModel } from '../models/LibroModel';

/**
 * LibroViewModel - Patrón MVVM
 * Solo mapeo de datos, sin lógica de negocio
 * Se usa para presentar datos a la vista (frontend)
 */
export class LibroViewModel {
  id: number;
  titulo: string;
  generoLiterario: string;
  portadaBase64: string;
  pdfBase64: string;
  universidadPropietaria: string;
  isExternal: boolean; 

  constructor(libro: LibroModel, isExternal: boolean = false) {
    this.id = libro.id;
    this.titulo = libro.titulo;
    this.generoLiterario = libro.generoLiterario;
    this.portadaBase64 = libro.portadaBase64;
    this.pdfBase64 = libro.pdfBase64;
    this.universidadPropietaria = libro.universidadPropietaria;
    this.isExternal = isExternal; 
  }

  /**
   * Mapeo estático desde LibroModel a LibroViewModel
   */
  static fromModel(libro: LibroModel, isExternal: boolean = false): LibroViewModel {
    return new LibroViewModel(libro, isExternal);
  }

  /**
   * Mapeo de un array de LibroModel
   */
  static fromModelArray(libros: LibroModel[], isExternal: boolean = false): LibroViewModel[] {
    return libros.map((libro) => LibroViewModel.fromModel(libro, isExternal));
  }
}