import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LibroEntity } from '../../LibroEntity';
import { LibroModel, CreateLibroDto, UpdateLibroDto } from '../../domain/models/LibroModel';
import { LibroDao } from '../../domain/dao/LibroDao';

/**
 * LibroCqrs - Patrón CQRS
 * Maneja SOLO comandos (INSERT, UPDATE, DELETE)
 * Flujo: MVC > CQRS > DAO (para validaciones)
 */
@Injectable()
export class LibroCqrs {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
    private readonly libroDao: LibroDao,
  ) {}

  /**
   * Comando: Crear nuevo libro
   */
  async createLibro(dto: CreateLibroDto): Promise<LibroModel> {
    console.log(`[CQRS] Ejecutando comando: Crear libro "${dto.titulo}"`);

    // Validar que no exista (usa DAO)
    const exists = await this.libroDao.existsByTitulo(dto.titulo);
    if (exists) {
      throw new Error('Ya existe un libro con ese título');
    }

    // Crear entidad
    const entity = this.libroRepository.create({
      titulo: dto.titulo,
      generoLiterario: dto.generoLiterario,
      portadaBase64: dto.portadaBase64,
      pdfBase64: dto.pdfBase64,
      universidadPropietaria: dto.universidadPropietaria || 'UTL',
    });

    // Guardar en BD
    const saved = await this.libroRepository.save(entity);

    return new LibroModel(
      saved.id,
      saved.titulo,
      saved.generoLiterario,
      saved.portadaBase64,
      saved.pdfBase64,
      saved.universidadPropietaria,
    );
  }

  /**
   * Comando: Actualizar libro
   */
  async updateLibro(
    id: number,
    dto: UpdateLibroDto,
  ): Promise<LibroModel | null> {
    console.log(`[CQRS] Ejecutando comando: Actualizar libro ID ${id}`);

    const entity = await this.libroRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    // Actualizar campos
    if (dto.titulo) entity.titulo = dto.titulo;
    if (dto.generoLiterario) entity.generoLiterario = dto.generoLiterario;
    if (dto.portadaBase64) entity.portadaBase64 = dto.portadaBase64;
    if (dto.pdfBase64) entity.pdfBase64 = dto.pdfBase64;

    const updated = await this.libroRepository.save(entity);

    return new LibroModel(
      updated.id,
      updated.titulo,
      updated.generoLiterario,
      updated.portadaBase64,
      updated.pdfBase64,
      updated.universidadPropietaria,
    );
  }

  /**
   * Comando: Eliminar libro
   */
  async deleteLibro(id: number): Promise<boolean> {
    console.log(`[CQRS] Ejecutando comando: Eliminar libro ID ${id}`);

    const result = await this.libroRepository.delete(id);
    return result.affected > 0;
  }
}