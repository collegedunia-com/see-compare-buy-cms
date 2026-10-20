import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Blog } from '../blogs/models/blog.model';
import { SuccessInterceptorModule } from '../interceptors/success.interceptor.module';
import { MajorCategory } from '../major-category/models/major-category.model';
import { MinorCategoryController } from './minor-category.controller';
import { MinorCategoryService } from './minor-category.service';
import { MinorCategory } from './models/minor-category.model';

@Module({
  imports: [
    SequelizeModule.forFeature([MajorCategory, MinorCategory, Blog]),
    SuccessInterceptorModule,
  ],
  controllers: [MinorCategoryController],
  providers: [MinorCategoryService],
})
export class MinorCategoryModule {}
