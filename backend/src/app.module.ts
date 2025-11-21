import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/LibrosModule';

@Module({
  imports: [LibrosModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
