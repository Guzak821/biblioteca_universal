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
    origin: 'http://localhost:5173',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
    console.log(`🚀 Backend corriendo en http://localhost:${process.env.PORT ?? 3000}`);

}
bootstrap();
