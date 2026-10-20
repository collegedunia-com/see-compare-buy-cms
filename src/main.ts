import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';
import { WinstonModule } from 'nest-winston';
import { transports, format } from 'winston';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import 'winston-daily-rotate-file'; 
import * as bodyParser from 'body-parser';
config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      transports: [
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-error.log`, 
          level: 'error',
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false, 
          maxFiles: '14d',
        }),
        new transports.DailyRotateFile({
          filename: `logs/%DATE%-combined.log`,
          format: format.combine(format.timestamp(), format.json()),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: false,
          maxFiles: '7',
        }),
        new transports.Console({
         format: format.combine(
           format.cli(),
           format.splat(),
           format.timestamp(),
           format.printf((info) => {
             return `${info.timestamp} ${info.level}: ${info.message}`;
           }),
          ),
      }),
      ],
    }),
  });

  const config = new DocumentBuilder()
  .setTitle('VIP Fortunes CMS')
  .setDescription('This is the API documentation for VIP Fortunes CMS')
  .setVersion('1.0')
  .addTag('VIP Fortunes CMS')
  .setBasePath('api/v1')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const logger = new Logger('bootstrap');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters
  app.setGlobalPrefix('api/v1');
  app.enableCors();
  app.use(bodyParser.json({limit: '50mb'}));
  app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
  await app.listen(process.env.PORT || 5001);
  
  logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
