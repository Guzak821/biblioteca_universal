import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/LibrosModule';
import { AuthModule } from './auth/auth.module'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UsuariosModule } from './usuarios/UsuariosModule';

@Module({
  imports: [
    LibrosModule, 
    TypeOrmModule.forRoot(databaseConfig),
    UsuariosModule, 
    AuthModule,
    LibrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
