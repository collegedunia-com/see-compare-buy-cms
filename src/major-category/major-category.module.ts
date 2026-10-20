import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from '../blogs/models/blog.model';
import { SuccessInterceptorModule } from '../interceptors/success.interceptor.module';
import { MinorCategory } from '../minor-category/models/minor-category.model';
import { MajorCategoryController } from './major-category.controller';
import { MajorCategoryService } from './major-category.service';
import { MajorCategory } from './models/major-category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([MajorCategory, MinorCategory, Blog]),
    SuccessInterceptorModule,
  ],
  controllers: [MajorCategoryController],
  providers: [MajorCategoryService],
  exports: [MajorCategoryService],
})
export class MajorCategoryModule {}
