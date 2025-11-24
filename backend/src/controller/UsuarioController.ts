import { Injectable } from '@nestjs/common';
import { UsuarioDao } from '../usuarios/UsuarioDao';
import { UsuarioCqrs } from '../usuarios/UsuarioCqrs';
import { UsuarioModel, CreateUsuarioDto, UpdateUsuarioDto } from '../usuarios/UsuarioModel';
import * as bcrypt from 'bcrypt';

/**
 * UsuarioController - Patrón MVC (Controller)
 * Maneja las peticiones relacionadas con los Usuarios (Login y CRUD)
 * Puede utilizar clases: DAO, CQRS
 */
@Injectable()
export class UsuarioController {
  constructor(
    private readonly usuarioDao: UsuarioDao,
    private readonly usuarioCqrs: UsuarioCqrs,
  ) {}

  /**
   * Maneja la petición de Login
   * Flujo: MVC > DAO (solo consulta)
   * @param usuario Nombre de usuario ingresado
   * @param contrasena Contraseña ingresada
   * @returns Objeto con el estado del login y datos del usuario
   */
  public async handleLogin(
    usuario: string,
    contrasena: string,
  ): Promise<{
    success: boolean;
    user?: UsuarioModel;
    message: string;
  }> {
    console.log(`[UsuarioController] Procesando login para: ${usuario}`);

    // Consultar usuario usando DAO
    const user = await this.usuarioDao.findByUsuario(usuario);

    if (!user) {
      return {
        success: false,
        message: 'Credenciales incorrectas. Verifique usuario y/o contraseña.',
      };
    }

    // Comparar contraseña hasheada
    const isValid = await bcrypt.compare(contrasena, user.contrasena);

    if (!isValid) {
      return {
        success: false,
        message: 'Credenciales incorrectas. Verifique usuario y/o contraseña.',
      };
    }

    console.log(
      `[UsuarioController] Login exitoso para: ${user.usuario} con rol: ${user.rol}`,
    );

    return {
      success: true,
      user: user,
      message: 'Credenciales válidas. Redirigiendo...',
    };
  }

  /**
   * Maneja la petición de obtener todos los usuarios (para CRUD Bibliotecario)
   * Flujo: MVC > DAO
   * Implementa los patrones MVC y DAO
   */
  public async handleGetUsers(): Promise<UsuarioModel[]> {
    console.log('[UsuarioController] Consultando todos los usuarios');
    // El DAO maneja todas las consultas
    return await this.usuarioDao.findAll();
  }

  /**
   * Maneja la petición de obtener un usuario por ID
   * Flujo: MVC > DAO
   */
  public async handleGetUserById(id: number): Promise<UsuarioModel | null> {
    console.log(`[UsuarioController] Consultando usuario ID: ${id}`);
    return await this.usuarioDao.findById(id);
  }

  /**
   * Maneja la petición de registro de un nuevo usuario
   * Flujo: MVC > CQRS > DAO
   * Implementa los patrones MVC, CQRS y DAO
   * @param dto Datos del nuevo usuario
   * @returns El usuario recién creado
   */
  public async handleRegisterUser(
    dto: CreateUsuarioDto,
  ): Promise<UsuarioModel> {
    console.log(`[UsuarioController] Registrando usuario: ${dto.usuario}`);
    // Llama al CQRS para ejecutar el comando de modificación (registro)
    return await this.usuarioCqrs.createUsuario(dto);
  }

  /**
   * Maneja la petición de edición de un usuario existente
   * Flujo: MVC > CQRS > DAO
   * Implementa los patrones MVC, CQRS y DAO
   * @param id ID del usuario a editar
   * @param dto Datos actualizados del usuario
   * @returns El usuario actualizado o null
   */
  public async handleEditUser(
    id: number,
    dto: UpdateUsuarioDto,
  ): Promise<UsuarioModel | null> {
    console.log(`[UsuarioController] Editando usuario ID: ${id}`);
    // Llama al CQRS para ejecutar el comando de modificación (edición)
    return await this.usuarioCqrs.updateUsuario(id, dto);
  }

  /**
   * Maneja la petición de eliminación de un usuario
   * Flujo: MVC > CQRS > DAO
   * Implementa los patrones MVC, CQRS y DAO
   * @param id ID del usuario a eliminar
   * @returns true si se eliminó, false si no existe
   */
  public async handleDeleteUser(id: number): Promise<boolean> {
    console.log(`[UsuarioController] Eliminando usuario ID: ${id}`);
    // Llama al CQRS para ejecutar el comando de modificación (eliminación)
    return await this.usuarioCqrs.deleteUsuario(id);
  }
}