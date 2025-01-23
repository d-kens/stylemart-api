import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const message = exception.getResponse();

    // Customize the response format to include the message at the top level
    response.status(status).json({
      statusCode: status,
      message: typeof message === 'string' ? message : message['message'] || 'An error occurred',
      path: ctx.getRequest().url,
      timestamp: new Date().toISOString(),
    });
  }
}
