// controller para el login de usuarios
import { Controller, Post, Body, Res, Req } from '@nestjs/common';
import { Request, Response } from 'express';
import { UsuarioDao } from 'src/usuarios/domain/dao/usuario-dao';

@Controller('login')
export class LoginController {
  
  constructor(private readonly usuarioDao: UsuarioDao) { // Inyección del DAO
  }
  
  @Post() // <--- ¡Aquí defines el método POST en la ruta base!
  async login(@Body() body: any) { // Usa DTO para el cuerpo
    const { usuario, password } = body;
    
    const user = await this.usuarioDao.findByUser(usuario, password);

    if (!user) {
      return { success: false, message: 'Credenciales inválidas' };
    }

    return { 
      success: true, 
      user: { id: user.id, usuario: user.user, password: usuario, rol: user.rol } 
    };
  }
}