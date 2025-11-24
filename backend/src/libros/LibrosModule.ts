import { Module, OnModuleInit } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LibroEntity } from '../libros/LibroEntity';
import { LibroDao } from '../libros/domain/dao/LibroDao';
import { LibroCqrs } from '../libros/aplication/mvc/LibroCqrs';
import { LibroController } from '../controller/LibroController';
import { LibrosController } from './libros.controller';
import { UnamApiService } from './infraestucture/api-service/UnamApiService';
import { OxfordApiService } from './infraestucture/api-service/OxfordApiService';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([LibroEntity])],
  controllers: [LibrosController],
  providers: [
    LibroDao,
    LibroCqrs,
    LibroController,
    UnamApiService,
    OxfordApiService,
  ],
  exports: [LibroController, LibroDao, LibroCqrs],
})
export class LibrosModule implements OnModuleInit {
  constructor(
    @InjectRepository(LibroEntity)
    private readonly libroRepository: Repository<LibroEntity>,
  ) {}

  async onModuleInit() {
    // Crear libros mock si no existen
    const count = await this.libroRepository.count();

    if (count === 0) {
      console.log('📚 Insertando libros iniciales...');

      const librosMock = [
        {
          titulo: 'Álgebra de Baldor',
          generoLiterario: 'Matemáticas',
          portadaBase64: 'https://placehold.co/200x300/087990/ffffff?text=Algebra',
          pdfBase64: 'mock_pdf_base64_baldor',
          universidadPropietaria: 'UTL',
        },
        {
          titulo: 'Cálculo Diferencial',
          generoLiterario: 'Matemáticas',
          portadaBase64: 'https://placehold.co/200x300/2ecc71/ffffff?text=Calculo',
          pdfBase64: 'mock_pdf_base64_calculo',
          universidadPropietaria: 'UTL',
        },
        {
          titulo: 'Biología Molecular',
          generoLiterario: 'Biología',
          portadaBase64: 'https://placehold.co/200x300/e74c3c/ffffff?text=Biologia',
          pdfBase64: 'mock_pdf_base64_biologia',
          universidadPropietaria: 'UTL',
        },
      ];

      for (const libroData of librosMock) {
        const libro = this.libroRepository.create(libroData);
        await this.libroRepository.save(libro);
        console.log(`✅ Libro creado: ${libroData.titulo}`);
      }

      console.log('✅ Libros mock insertados');
    } else {
      console.log('ℹ️  La base de datos ya tiene libros');
    }
  }
}