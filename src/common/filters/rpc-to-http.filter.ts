import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const err = exception.getError() as any;

    const status =
      typeof err.statusCode === 'number' ? err.statusCode : HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message ?? err;

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
}
