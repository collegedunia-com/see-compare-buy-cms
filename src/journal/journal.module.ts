import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from '../blogs/models/blog.model';
import { SuccessInterceptorModule } from '../interceptors/success.interceptor.module';
import { MajorCategory } from '../major-category/models/major-category.model';
import { JournalController } from './journal.controller';
import { JournalService } from './journal.service';

@Module({
  imports: [
    SequelizeModule.forFeature([MajorCategory, Blog]),
    SuccessInterceptorModule,
  ],
  controllers: [JournalController],
  providers: [JournalService],
})
export class JournalModule {}
