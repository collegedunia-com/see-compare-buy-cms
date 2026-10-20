import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

@Injectable()
export class SuccessInterceptor<T> implements NestInterceptor<T, unknown> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<unknown> {
    const start = performance.now();
    const response = context.switchToHttp().getResponse<Response>();

    return next.handle().pipe(
      map((data) => {
        const statusCode = response.statusCode;
        if (statusCode === 204 || statusCode === 304) return data;

        return {
          statusCode,
          ...(process.env.NODE_ENV === 'development' && {
            responseTime: `${(performance.now() - start).toFixed(2)}ms`,
          }),
          message:
            typeof data === 'object' && data !== null && 'message' in data
              ? data.message
              : 'Request successful',
          data,
          timestamp: new Date().toISOString(),
        };
      }),
    );
  }
}
