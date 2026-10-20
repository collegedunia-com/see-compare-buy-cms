import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { SuccessInterceptor } from '../interceptors/success.interceptor';
import { MinorCategoryService } from './minor-category.service';

@Controller('minor-category')
@UseInterceptors(SuccessInterceptor)
export class MinorCategoryController {
  constructor(private readonly minorCategoryService: MinorCategoryService) {}

  @Get()
  findAll() {
    return this.minorCategoryService.findAll();
  }

  @Get(':major_category/:slug')
  findOne(
    @Param('major_category') majorSlug: string,
    @Param('slug') minorSlug: string,
  ) {
    return this.minorCategoryService.findOne(majorSlug, minorSlug);
  }
}
