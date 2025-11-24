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
  universidadPropietaria: string;

  constructor(libro: LibroModel) {
    this.id = libro.id;
    this.titulo = libro.titulo;
    this.generoLiterario = libro.generoLiterario;
    this.portadaBase64 = libro.portadaBase64;
    this.universidadPropietaria = libro.universidadPropietaria;
  }

  /**
   * Mapeo estático desde LibroModel a LibroViewModel
   */
  static fromModel(libro: LibroModel): LibroViewModel {
    return new LibroViewModel(libro);
  }

  /**
   * Mapeo de un array de LibroModel
   */
  static fromModelArray(libros: LibroModel[]): LibroViewModel[] {
    return libros.map((libro) => LibroViewModel.fromModel(libro));
  }
}