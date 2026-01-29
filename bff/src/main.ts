import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); // Validação de dados
  app.enableCors(); // Permite requisições cross-origin (ex: frontend React)
  app.setGlobalPrefix('api'); // Opcional: adiciona /api a todas as rotas
  
  await app.listen(process.env.PORT ?? 3300);
}
bootstrap();
