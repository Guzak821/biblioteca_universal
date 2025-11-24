import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { LibroController } from '@app/controller/LibroController';
import { CreateLibroDto, UpdateLibroDto } from '../libros/domain/models/LibroModel';

/**
 * LibrosController - API REST de NestJS
 * Endpoints HTTP que delegan al LibroController (MVC)
 */
@Controller('api/libros')
export class LibrosController {
  constructor(private readonly libroController: LibroController) {}

  // --- ENDPOINTS PARA BIBLIOTECARIO (CRUD Interno) ---

  /**
   * GET /api/libros
   * Obtener todos los libros internos
   * Patrón: MVC > DAO
   */
  @Get()
  async findAll() {
    try {
      const libros = await this.libroController.handleGetAllInternalBooks();

      // No enviar el PDF completo en la lista (solo en detalle)
      return libros.map((libro) => ({
        id: libro.id,
        titulo: libro.titulo,
        generoLiterario: libro.generoLiterario,
        portadaBase64: libro.portadaBase64,
        universidadPropietaria: libro.universidadPropietaria,
        pdfBase64: libro.pdfBase64, 
      })); 
    } catch (error) {
      throw new HttpException(
        'Error al obtener libros',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

 @Get('search')
  async search(@Query('filtro') filtro: string) {
    try {
      const libros = await this.libroController.handleSearchBooks(filtro || '');
      return libros;
    } catch (error) {
      throw new HttpException(
        'Error en la búsqueda',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/libros/:id
   * Obtener un libro por ID
   * Patrón: MVC > DAO
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const libro = await this.libroController.handleGetBookById(id);

      if (!libro) {
        throw new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
      }

      return libro;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener libro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/libros
   * Crear nuevo libro
   * Patrón: MVC > CQRS > DAO
   */
  @Post()
  async create(@Body() dto: CreateLibroDto) {
    try {
      const libro = await this.libroController.handleCreateBook(dto);

      return {
        success: true,
        message: 'Libro creado exitosamente',
        data: libro,
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear libro',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * PUT /api/libros/:id
   * Actualizar libro
   * Patrón: MVC > CQRS > DAO
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateLibroDto,
  ) {
    try {
      const libro = await this.libroController.handleUpdateBook(id, dto);

      if (!libro) {
        throw new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Libro actualizado exitosamente',
        data: libro,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al actualizar libro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/libros/:id
   * Eliminar libro
   * Patrón: MVC > CQRS > DAO
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const deleted = await this.libroController.handleDeleteBook(id);

      if (!deleted) {
        throw new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Libro eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al eliminar libro',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // --- ENDPOINTS PARA ALUMNO (Búsqueda Global) ---

  /**
   * GET /api/libros/search
   * Búsqueda global (internos + externos)
   * Patrón: MVC > DAO + ApiService (DDD) > ViewModel (MVVM)
   */


 /**
   * GET /api/libros/file/pdf  <-- RUTA MODIFICADA
   * Obtener PDF de un libro (interno o externo)
   * Patrón: MVC > DAO (interno) o ApiService (externo) > ViewModel
   */
  @Get('file/pdf') // <-- Nueva ruta
  async getPdf(
    @Query('id') id: string,
    @Query('universidad') universidad: string,
    @Query('external') external: string,
  ) {
    try {
      const isExternal = external === 'true';
      const pdfBase64 = await this.libroController.handleGetPdfContent(
        id,
        universidad,
        isExternal,
      );

      if (!pdfBase64) {
        throw new HttpException(
          'PDF no encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      return { pdfBase64 };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener PDF',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}