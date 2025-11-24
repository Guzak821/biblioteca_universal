import { Module } from '@nestjs/common';
import { AuthController } from './AuthController';
import { AuthService } from './AuthService';
import { UsuariosModule } from '../usuarios/UsuariosModule';

@Module({
  imports: [UsuariosModule], // ← Importar el módulo de usuarios
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}