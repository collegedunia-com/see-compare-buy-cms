import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, finalize } from 'rxjs';
import { LoggerService } from '../logger/logger.service';

@Injectable()
export class ResponseTimeInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest<{
      method: string;
      originalUrl: string;
    }>();
    const start = performance.now();

    return next.handle().pipe(
      finalize(() => {
        const durationMs = (performance.now() - start).toFixed(2);
        this.logger.log(
          `${request.method} ${request.originalUrl} - ${durationMs}ms`,
          'ResponseTime',
        );
      }),
    );
  }
}
