import { Controller, Get, Query, NotFoundException, UseGuards } from '@nestjs/common';
import { AcitivityLogsService } from './activity-logs.service';
import { AdminGuard } from 'src/auth/guards/admin.guard';


@Controller('activity-logs')
export class ActivityLogsController {
  constructor(private readonly acitivityLogsService: AcitivityLogsService,
  ) { }

  @Get()
  @UseGuards(AdminGuard)
  async findAll(
    @Query('limit') limit: string = '10',
    @Query('offset') offset: string = '0',
    @Query('method') method: string = '',
  ) {

    const parsedLimit = +limit || 10;
    const parsedOffset = +offset || 0;

    const data = await this.acitivityLogsService.findAll(parsedLimit, parsedOffset, method);

    if (!data)
      throw new NotFoundException('No data found');

    return {
      total_count: data.count,
      count: data.rows.length,
      limit: parsedLimit,
      offset: parsedOffset,
      data: data.rows,
    };
  }
}
