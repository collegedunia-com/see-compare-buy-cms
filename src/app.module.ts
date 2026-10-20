import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ConfigModule } from '@nestjs/config';
import { MajorCategoryModule } from './major-category/major-category.module';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { AuthGuard } from './auth/guards/auth.guard';
import { APP_GUARD } from '@nestjs/core';
import { ActivityLogsGuard } from './auth/guards/activity_logs.guard';
import { ActivityLog } from './activity-logs/models/activity-logs.model';
import { MinorCategoryModule } from './minor-category/minor-category.module';
import { FileManagerService } from './file-manager/file-manager.service';
import { HomeModule } from './home/home.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { FileController } from './file-manager/file.controller';
import { ActivityLogsModule } from './activity-logs/activity-logs.module';
import { DatabaseModule } from './database/database.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    DatabaseModule,
    MajorCategoryModule,
    AuthModule,
    UserModule,
    SequelizeModule.forFeature([ActivityLog]),
    MinorCategoryModule,
    HomeModule,
    NestjsFormDataModule,
    ActivityLogsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ActivityLogsGuard,
    },
    FileManagerService,
  ],
  controllers: [FileController],
  // exports: [LoggerService],
})
export class AppModule {}
