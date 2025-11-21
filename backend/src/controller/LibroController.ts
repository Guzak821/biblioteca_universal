import { Controller, Get, Post, Body, Param, Put, Delete, Query, HttpStatus, HttpException } from '@nestjs/common';
import { LibrosService } from '../libros/domain/service/LibrosService';
import { LibroModel } from '../libros/domain/models/LibroModel';
import { LibroViewModel } from '../libros/domain/view-model/LibroViewModel';

// DTOs simplificados para Request Body (en un proyecto real se usarían clases DTO)
interface CreateBookDto extends Omit<LibroModel, 'id'> {}
interface UpdateBookDto extends LibroModel {}

@Controller('libros') // Ruta base: /libros
export class LibrosController {
  constructor(private readonly librosService: LibrosService) {}
  
  // --- ENDPOINTS PARA EL ALUMNO (Buscador Global) ---
  
  @Get('search')
  async searchBooks(@Query('filtro') filtro: string): Promise<LibroViewModel[]> {
    // Flujo: Controller -> Service.searchBooks -> (DAO + ApiService) -> ViewModel
    return this.librosService.searchBooks(filtro || '');
  }

  @Get('pdf')
  async getPdf(
    @Query('id') id: string,
    @Query('universidad') universidad: string,
    @Query('external') external: string,
  ): Promise<{ pdfBase64: string }> {
    const isExternal = external === 'true';
    const pdfBase64 = await this.librosService.getPdfContent(id, universidad, isExternal);
    
    if (!pdfBase64) {
      throw new HttpException('Libro o PDF no encontrado', HttpStatus.NOT_FOUND);
    }
    
    // Retorna el PDF en base64 para que el frontend lo visualice
    return { pdfBase64 }; 
  }

  // --- ENDPOINTS PARA EL BIBLIOTECARIO (CRUD Interno) ---

  @Get('admin')
  findAllAdmin(): LibroModel[] {
    // Flujo: Controller -> Service.findAllInternalBooks -> DAO
    return this.librosService.findAllInternalBooks();
  }

  @Post('admin')
  create(@Body() createBookDto: CreateBookDto): LibroModel {
    // Flujo: MVC -> CQRS -> DAO
    return this.librosService.registerBook(createBookDto);
  }

  @Put('admin/:id')
  update(@Param('id') id: string, @Body() updateBookDto: UpdateBookDto): LibroModel {
    const updatedBook = this.librosService.editBook({ ...updateBookDto, id: Number(id) });
    if (!updatedBook) {
        throw new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
    }
    return updatedBook;
  }

  @Delete('admin/:id')
  remove(@Param('id') id: string): { message: string } {
    const deleted = this.librosService.deleteBook(Number(id));
    if (!deleted) {
        throw new HttpException('Libro no encontrado', HttpStatus.NOT_FOUND);
    }
    return { message: `Libro con ID ${id} eliminado correctamente.` };
  }
}