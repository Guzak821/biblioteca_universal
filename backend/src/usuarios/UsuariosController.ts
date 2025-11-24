import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpException,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { UsuarioController } from '../controller/UsuarioController';
import { CreateUsuarioDto, UpdateUsuarioDto } from './UsuarioModel';

/**
 * UsuariosController - API REST para CRUD de usuarios
 * Este es el endpoint HTTP de NestJS
 * Delega toda la lógica al UsuarioController (MVC)
 */
@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuarioController: UsuarioController) {}

  /**
   * GET /api/usuarios
   * Obtener todos los usuarios
   * Patrón: MVC > DAO
   */
  @Get()
  async findAll() {
    try {
      const usuarios = await this.usuarioController.handleGetUsers();

      // No enviar las contraseñas al frontend
      return usuarios.map((u) => ({
        id: u.id,
        usuario: u.usuario,
        rol: u.rol,
      }));
    } catch (error) {
      throw new HttpException(
        'Error al obtener usuarios',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * GET /api/usuarios/:id
   * Obtener un usuario por ID
   * Patrón: MVC > DAO
   */
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    try {
      const usuario = await this.usuarioController.handleGetUserById(id);

      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        id: usuario.id,
        usuario: usuario.usuario,
        rol: usuario.rol,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al obtener usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * POST /api/usuarios
   * Crear un nuevo usuario
   * Patrón: MVC > CQRS > DAO
   */
  @Post()
  async create(@Body() dto: CreateUsuarioDto) {
    try {
      const usuario = await this.usuarioController.handleRegisterUser(dto);

      return {
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          id: usuario.id,
          usuario: usuario.usuario,
          rol: usuario.rol,
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al crear usuario',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * PUT /api/usuarios/:id
   * Actualizar un usuario
   * Patrón: MVC > CQRS > DAO
   */
  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUsuarioDto,
  ) {
    try {
      const usuario = await this.usuarioController.handleEditUser(id, dto);

      if (!usuario) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: {
          id: usuario.id,
          usuario: usuario.usuario,
          rol: usuario.rol,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al actualizar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /**
   * DELETE /api/usuarios/:id
   * Eliminar un usuario
   * Patrón: MVC > CQRS > DAO
   */
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    try {
      const deleted = await this.usuarioController.handleDeleteUser(id);

      if (!deleted) {
        throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
      }

      return {
        success: true,
        message: 'Usuario eliminado exitosamente',
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'Error al eliminar usuario',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}