import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'reflect-metadata';
import { HttpExceptionFilter } from './http-exception.filter';
import { TransformInterceptor } from './transform.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Task management API')
    .setDescription('The task management API description')
    .setVersion('1.0')
    .addTag('task management')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('openapis', app, document);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new TransformInterceptor());
  await app.listen(3000);
}

bootstrap();
