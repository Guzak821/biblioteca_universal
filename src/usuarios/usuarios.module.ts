// src/usuarios/usuarios.module.ts
import { Module } from '@nestjs/common';
import { LoginController } from './aplication/mvc/login-controller';
import { UsuarioDao } from './domain/dao/usuario-dao';

@Module({
  imports: [/* Módulos de TypeORM, Base de Datos, etc. */],
  controllers: [LoginController], 
  providers: [UsuarioDao],       
  exports: [UsuarioDao]
})
export class UsuariosModule {}