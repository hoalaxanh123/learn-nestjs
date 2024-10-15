// src/http-exception.filter.ts
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';
import * as winston from 'winston';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private logger: winston.Logger;

  constructor() {
    // Configure Winston to log to a file
    this.logger = winston.createLogger({
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
      transports: [new winston.transports.File({ filename: 'error.log' })],
    });
  }

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    // Extract the real error message
    const realErrorMessage = exception.getResponse();
    const message =
      typeof realErrorMessage === 'string'
        ? realErrorMessage
        : (realErrorMessage as any).message || 'An unexpected error occurred';

    // Log the error
    this.logger.error({
      timestamp: new Date().toISOString(),
      statusCode: status,
      message: realErrorMessage,
    });

    // Customize the response message
    let customMessage = 'An error occurred';
    switch (status) {
      case 400:
        customMessage = 'Bad Request: Invalid input';
        break;
      case 401:
        customMessage = 'Unauthorized: User not authenticated';
        break;
      case 403:
        customMessage = 'Forbidden: Access denied';
        break;
      case 404:
        customMessage = 'Not Found: Resource not found';
        break;
      case 409:
        customMessage = 'Conflict: Resource conflict';
        break;
      case 500:
        customMessage = 'Internal Server Error: An unexpected error occurred';
        break;
      // Add other cases as needed
      default:
        customMessage = 'An unexpected error occurred';
    }

    // Send the customized response
    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: customMessage,
      additionalInfo: message,
    });
  }
}
