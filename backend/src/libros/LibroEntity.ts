import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * Entidad Libro - TypeORM
 * Representa la tabla 'libros' en la base de datos
 */
@Entity('libros')
export class LibroEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 200 })
  titulo: string;

  @Column({ name: 'genero_literario', length: 100 })
  generoLiterario: string;

  @Column({ name: 'portada_base64', type: 'text', nullable: true })
  portadaBase64: string;

  @Column({ name: 'pdf_base64', type: 'text', nullable: true })
  pdfBase64: string;

  @Column({ name: 'universidad_propietaria', length: 50, default: 'UTL' })
  universidadPropietaria: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}