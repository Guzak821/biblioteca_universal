import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Usuario - TypeORM
 * Representa la tabla 'usuarios' en la base de datos
 * Compatible con SQLite
 */
@Entity('usuarios')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true, length: 50 })
  usuario: string;

  @Column({ length: 255 })
  contrasena: string;

  @Column({ type: 'text', default: 'Alumno' }) 
  rol: 'Bibliotecario' | 'Alumno';

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}