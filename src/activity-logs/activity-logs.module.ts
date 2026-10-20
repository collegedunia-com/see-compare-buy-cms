import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { ActivityLogsController } from './activity-logs.controller';
import { AcitivityLogsService } from './activity-logs.service';
import { ActivityLog } from './models/activity-logs.model';

@Module({
  controllers: [ActivityLogsController],
  providers: [AcitivityLogsService],
  imports: [SequelizeModule.forFeature([ActivityLog])],
})
export class ActivityLogsModule {}
