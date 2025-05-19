import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { AllRpcExceptionsFilter } from '../../../common/filters/rpc-exception.filter';

async function bootstrap() {
  // Create microservice
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.TCP,
    options: {
      host: process.env.AUTH_SERVICE_HOST || '0.0.0.0',
      port: parseInt(process.env.AUTH_SERVICE_PORT || '8001'),
    },
  });

  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllRpcExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen();
  console.log(
    `Auth Microservice is running on ${process.env.AUTH_SERVICE_HOST || 'localhost'}:${process.env.AUTH_SERVICE_PORT || '8001'}`,
  );
}
bootstrap();
