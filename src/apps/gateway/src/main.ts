import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../../../common/filters/http-exception.filter';
import { RpcToHttpExceptionFilter } from '../../../common/filters/rpc-to-http.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global pipes and filters
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new RpcToHttpExceptionFilter(), new HttpExceptionFilter());

  await app.listen(process.env.GATEWAY_PORT || 8000);
  console.log(`Gateway Server is running on port ${process.env.GATEWAY_PORT || 8000}`);
}
bootstrap();
