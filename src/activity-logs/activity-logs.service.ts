import { HttpException, Injectable, HttpStatus, ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActivityLog } from './models/activity-logs.model';


@Injectable()
export class AcitivityLogsService {

  constructor(
    @InjectModel(ActivityLog)
    private activityLogModel: typeof ActivityLog,
  ) { }

  async findAll(limit: number = 10, offset: number = 0, method: string = '') {

    const where = {};

    if (method) {
      where['method'] = method;
    }

    const data = await this.activityLogModel.findAndCountAll({ 
      where, 
      limit, 
      offset,
      order: [['id', 'DESC']]
    });
    

    if (data) {
      return data;
    } else {
      throw new NotFoundException('No data found');
    }
    
  }
}
