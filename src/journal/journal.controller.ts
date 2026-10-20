import {
  BadRequestException,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { SuccessInterceptor } from '../interceptors/success.interceptor';
import { JournalService } from './journal.service';

@Controller('journal')
@UseInterceptors(SuccessInterceptor)
export class JournalController {
  constructor(private readonly journalService: JournalService) {}

  @Get()
  landing() {
    return this.journalService.landing();
  }

  @Get(':categorySlug')
  category(
    @Param('categorySlug') categorySlug: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    this.validatePagination(page, limit);
    return this.journalService.category(categorySlug, page, limit);
  }

  @Get(':categorySlug/:articleSlug')
  article(
    @Param('categorySlug') categorySlug: string,
    @Param('articleSlug') articleSlug: string,
  ) {
    return this.journalService.article(categorySlug, articleSlug);
  }

  private validatePagination(page: number, limit: number): void {
    if (page < 1 || limit < 1 || limit > 50) {
      throw new BadRequestException(
        'page must be at least 1 and limit must be between 1 and 50',
      );
    }
  }
}
