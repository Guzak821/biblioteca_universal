import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from '../../usuario.entity';
import { UsuarioModel, CreateUsuarioDto, UpdateUsuarioDto } from '../../domain/model/UsuarioModel';
import { UsuarioDao } from '../../domain/dao/UsuarioDao';
import * as bcrypt from 'bcrypt';

/**
 * UsuarioCqrs - Patrón CQRS con TypeORM
 * Maneja SOLO comandos (INSERT, UPDATE, DELETE)
 */
@Injectable()
export class UsuarioCqrs {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
    private readonly usuarioDao: UsuarioDao,
  ) {}

  /**
   * Comando: Crear nuevo usuario
   */
  async createUsuario(dto: CreateUsuarioDto): Promise<UsuarioModel> {
    console.log(`[CQRS] Ejecutando comando: Registrar usuario ${dto.usuario}`);

    // Validar que no exista (usa DAO para consulta)
    const exists = await this.usuarioDao.exists(dto.usuario);
    if (exists) {
      throw new Error('El usuario ya existe');
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(dto.contrasena, 10);

    // Crear entidad
    const entity = this.usuarioRepository.create({
      usuario: dto.usuario,
      contrasena: hashedPassword,
      rol: dto.rol,
    });

    // Guardar en BD
    const saved = await this.usuarioRepository.save(entity);

    return new UsuarioModel(
      saved.id,
      saved.usuario,
      saved.contrasena,
      saved.rol,
    );
  }

  /**
   * Comando: Actualizar usuario
   */
  async updateUsuario(id: number, dto: UpdateUsuarioDto): Promise<UsuarioModel | null> {
    console.log(`[CQRS] Ejecutando comando: Actualizar usuario ID ${id}`);

    const entity = await this.usuarioRepository.findOne({ where: { id } });
    if (!entity) {
      return null;
    }

    // Actualizar campos
    if (dto.usuario) entity.usuario = dto.usuario;
    if (dto.rol) entity.rol = dto.rol;
    
    // Si se actualiza la contraseña, hashearla
    if (dto.contrasena) {
      entity.contrasena = await bcrypt.hash(dto.contrasena, 10);
    }

    const updated = await this.usuarioRepository.save(entity);

    return new UsuarioModel(
      updated.id,
      updated.usuario,
      updated.contrasena,
      updated.rol,
    );
  }

  /**
   * Comando: Eliminar usuario
   */
  async deleteUsuario(id: number): Promise<boolean> {
    console.log(`[CQRS] Ejecutando comando: Eliminar usuario ID ${id}`);

    const result = await this.usuarioRepository.delete(id);
    return result.affected > 0;
  }
}