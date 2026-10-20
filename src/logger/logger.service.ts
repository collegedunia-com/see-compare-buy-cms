import { Injectable, LoggerService as NestLoggerService } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService implements NestLoggerService {
  private readonly logger: winston.Logger;
  private readonly apiLogger: winston.Logger;

  constructor() {
    const render = (value: unknown): string => {
      if (typeof value === 'string') return value;
      if (value instanceof Error) return value.stack ?? value.message;
      try {
        return JSON.stringify(value) ?? 'undefined';
      } catch {
        return '[unserializable]';
      }
    };

    const logFormat = winston.format.printf(
      ({ timestamp, level, message, context }) =>
        `${render(timestamp)} | ${render(level)} | ${render(context ?? 'API')} | ${render(message)}`,
    );

    this.logger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: 'logs/info-%DATE%.log',
          level: 'info',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '3d',
        }),
        new winston.transports.DailyRotateFile({
          filename: 'logs/error-%DATE%.log',
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '3d',
        }),
      ],
    });

    this.apiLogger = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat,
      ),
      transports: [
        new winston.transports.Console(),
        new winston.transports.DailyRotateFile({
          filename: 'logs/api/%DATE%-api.log',
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '3d',
        }),
      ],
    });
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string): void {
    this.logger.error(trace ? `${message} | Trace: ${trace}` : message, {
      context,
    });
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { context });
  }

  logApiRequest(message: string): void {
    this.apiLogger.info(message, { context: 'HTTP' });
  }
}
