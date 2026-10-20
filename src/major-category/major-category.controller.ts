import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { SuccessInterceptor } from '../interceptors/success.interceptor';
import { MajorCategoryService } from './major-category.service';

@Controller('major-category')
@UseInterceptors(SuccessInterceptor)
export class MajorCategoryController {
  constructor(private readonly majorCategoryService: MajorCategoryService) {}

  @Get()
  findAll() {
    return this.majorCategoryService.findAll();
  }

  @Get(':major_category')
  findBySlug(@Param('major_category') slug: string) {
    return this.majorCategoryService.findBySlug(slug);
  }
}
