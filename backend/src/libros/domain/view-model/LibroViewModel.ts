import { LibroModel } from '../models/LibroModel';
import { Injectable } from '@nestjs/common';

/**
 * Modelo de Vista que representa cómo se mostrará un libro en la pantalla de búsqueda.
 */
export interface LibroViewModel {
  titulo: string;
  universidad: string; 
  genero: string; 
  portadaBase64: string; 
  identificadorLibro: string | number; 
  identificadorUniversidad: string; 
  isExternal: boolean;
}

@Injectable() // El mapeador puede ser inyectable en NestJS
export class LibroViewModelMapper {
    public static mapInternalBook(model: LibroModel): LibroViewModel {
        return {
            titulo: model.titulo,
            universidad: model.universidadPropietaria,
            genero: model.generoLiterario,
            portadaBase64: model.portadaBase64,
            identificadorLibro: model.id,
            identificadorUniversidad: model.universidadPropietaria,
            isExternal: false,
        };
    }
    
     public static mapExternalBook(externalData: any, universityId: string): LibroViewModel {
        return {
            titulo: externalData.bookTitle,
            universidad: universityId,
            genero: externalData.genre,
            portadaBase64: externalData.coverImage,
            identificadorLibro: externalData.bookId,
            identificadorUniversidad: universityId,
            isExternal: true,
        };
    }
}