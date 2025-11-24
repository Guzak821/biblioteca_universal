import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { LibroEntity } from '../../LibroEntity';
import { LibroModel } from '../models/LibroModel';

/**
 * LibroDao - Patrón DAO
 * SOLO consultas (SELECT) a la base de datos
 * NO debe tener modificaciones
 */
@Injectable()
export class LibroDao {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  /**
   * Consulta todos los libros internos
   */
  async findAll(): Promise<LibroModel[]> {
    const entities = await this.libroRepository.find({
      order: { id: 'ASC' },
    });

    return entities.map(
      (e) =>
        new LibroModel(
          e.id,
          e.titulo,
          e.generoLiterario,
          e.portadaBase64,
          e.pdfBase64,
          e.universidadPropietaria,
        ),
    );
  }

  /**
   * Consulta un libro por ID
   */
  async findById(id: number): Promise<LibroModel | null> {
    const entity = await this.libroRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    return new LibroModel(
      entity.id,
      entity.titulo,
      entity.generoLiterario,
      entity.portadaBase64,
      entity.pdfBase64,
      entity.universidadPropietaria,
    );
  }

  /**
   * Busca libros por filtro (título o género)
   */
  async searchByFilter(filtro: string): Promise<LibroModel[]> {
    const entities = await this.libroRepository.find({
      where: [
        { titulo: Like(`%${filtro}%`) },
        { generoLiterario: Like(`%${filtro}%`) },
      ],
    });

    return entities.map(
      (e) =>
        new LibroModel(
          e.id,
          e.titulo,
          e.generoLiterario,
          e.portadaBase64,
          e.pdfBase64,
          e.universidadPropietaria,
        ),
    );
  }

  /**
   * Verifica si un libro existe por título
   */
  async existsByTitulo(titulo: string): Promise<boolean> {
    const count = await this.libroRepository.count({
      where: { titulo },
    });
    return count > 0;
  }
}