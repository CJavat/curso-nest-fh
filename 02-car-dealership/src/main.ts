import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Borra los datos que no deberían llegar a mi endpoint
      forbidNonWhitelisted: true, // Manda mensaje de error cuando mandan datos que mi endpoint no espera
    })
  )
  await app.listen(3000);
}
bootstrap();
