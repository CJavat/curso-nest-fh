import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); // Funciona para poner un prefijo global en la aplicación. Ejemplo: /'api'/las-demas-rutas

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true, // Funciona para convertir los parametros en numeros
      transformOptions: {
        enableImplicitConversion: true,
      }
    })
  )

  await app.listen( process.env.PORT );
}
bootstrap();
