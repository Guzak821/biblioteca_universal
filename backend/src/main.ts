import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. CONFIGURACIÓN PARA AUMENTAR EL LÍMITE DE PAYLOAD (Error 413)
  // Establece el límite de tamaño del cuerpo de la solicitud a 50MB.
  // Esto es necesario porque el Base64 de los archivos infla el tamaño del JSON.
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

   app.enableCors({
    origin: 'http://192.168.137.11:5173',
    credentials: true,
  });

 await app.listen(3003, '0.0.0.0');
  console.log('API disponible en: http://192.168.137.11:3003');
}

bootstrap();
