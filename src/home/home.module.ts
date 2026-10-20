import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MajorCategory } from 'src/major-category/models/major-category.model';
import { HomeController } from './home.controller';
import { HomeService } from './home.service';
import { MinorCategory } from 'src/minor-category/models/minor-category.model';
import { ActivityLog } from 'src/activity-logs/models/activity-logs.model';
import { User } from 'src/user/models/user.model';

@Module({
  controllers: [HomeController],
  providers: [HomeService],
  imports: [
    SequelizeModule.forFeature([
      MajorCategory,
      MinorCategory,
      ActivityLog,
      User,
    ]),
  ],
})
export class HomeModule {}
