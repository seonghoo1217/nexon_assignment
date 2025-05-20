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
      host: process.env.EVENT_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.EVENT_SERVICE_PORT || '8002'),
    },
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  // app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new AllRpcExceptionsFilter());

  await app.listen();
  console.log(
    `Event Microservice is running on ${process.env.EVENT_SERVICE_HOST || 'localhost'}:${process.env.EVENT_SERVICE_PORT || '8002'}`,
  );
}
bootstrap();
