import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../usuarios/usuario.entity';
import { UsuarioModel } from '../usuarios/UsuarioModel';

/**
 * UsuarioDao - Patrón DAO con TypeORM
 * SOLO contiene consultas a la base de datos (SELECT)
 */
@Injectable()
export class UsuarioDao {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  /**
   * Consulta un usuario por nombre de usuario
   */
  async findByUsuario(usuario: string): Promise<UsuarioModel | null> {
    const entity = await this.usuarioRepository.findOne({
      where: { usuario },
    });

    if (!entity) return null;

    return new UsuarioModel(
      entity.id,
      entity.usuario,
      entity.contrasena,
      entity.rol,
    );
  }

  /**
   * Consulta todos los usuarios
   */
  async findAll(): Promise<UsuarioModel[]> {
    const entities = await this.usuarioRepository.find({
      order: { id: 'ASC' },
    });

    return entities.map(
      (e) => new UsuarioModel(e.id, e.usuario, e.contrasena, e.rol),
    );
  }

  /**
   * Consulta un usuario por ID
   */
  async findById(id: number): Promise<UsuarioModel | null> {
    const entity = await this.usuarioRepository.findOne({
      where: { id },
    });

    if (!entity) return null;

    return new UsuarioModel(
      entity.id,
      entity.usuario,
      entity.contrasena,
      entity.rol,
    );
  }

  /**
   * Verifica si un usuario existe
   */
  async exists(usuario: string): Promise<boolean> {
    const count = await this.usuarioRepository.count({
      where: { usuario },
    });
    return count > 0;
  }
}