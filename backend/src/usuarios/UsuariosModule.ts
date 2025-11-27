import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './usuario.entity';
import { UsuarioDao } from '../usuarios/domain/dao/UsuarioDao';
import { UsuarioCqrs } from './aplication/mvc/UsuarioCqrs';
import { UsuarioController } from '../controller/UsuarioController';
import { UsuariosController } from '../usuarios/UsuariosController';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  controllers: [UsuariosController],
  providers: [UsuarioDao, UsuarioCqrs, UsuarioController],
  exports: [UsuarioController, UsuarioDao, UsuarioCqrs],
})
export class UsuariosModule implements OnModuleInit {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}

  async onModuleInit() {
    // Crear usuario admin si no existe
    const adminExists = await this.usuarioRepository.findOne({
      where: { usuario: 'admin' },
    });

    if (!adminExists) {
      const admin = this.usuarioRepository.create({
        usuario: 'admin',
        contrasena: await bcrypt.hash('1234', 10),
        rol: 'Bibliotecario',
      });
      await this.usuarioRepository.save(admin);
      console.log('✅ Usuario admin creado: admin / 1234');
    }

    const studentExists = await this.usuarioRepository.findOne({
      where: { usuario: 'student1' },
    });

    if (!studentExists) {
      const student = this.usuarioRepository.create({
        usuario: 'student1',
        contrasena: await bcrypt.hash('1234', 10),
        rol: 'Alumno',
      });
      await this.usuarioRepository.save(student);
      console.log('✅ Usuario student1 creado: student1 / 1234');
    }
  }
}