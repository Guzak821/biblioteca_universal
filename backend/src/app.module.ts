import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LibrosModule } from './libros/LibrosModule';
import { AuthController } from './auth/AuthController';

@Module({
  imports: [LibrosModule],
  controllers: [AppController, AuthController],
  providers: [AppService],
})
export class AppModule {}
