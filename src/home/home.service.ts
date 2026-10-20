import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ActivityLog } from 'src/activity-logs/models/activity-logs.model';
import { MajorCategory } from 'src/major-category/models/major-category.model';
import { MinorCategory } from 'src/minor-category/models/minor-category.model';
import { User } from 'src/user/models/user.model';

@Injectable()
export class HomeService {
  constructor(
    @InjectModel(MajorCategory)
    private majorCategoryModel: typeof MajorCategory,
    @InjectModel(MinorCategory)
    private minorCategoryModel: typeof MinorCategory,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(ActivityLog)
    private activityLogModel: typeof ActivityLog,
  ) {}

  async getHomeData() {
    const activeMajorCategoriesCount = await this.majorCategoryModel.count({
      where: {
        is_active: true,
      },
    });

    const inactiveMajorCategoriesCount = await this.majorCategoryModel.count({
      where: {
        is_active: false,
      },
    });

    const activeMinorCategoriesCount = await this.minorCategoryModel.count({
      where: {
        is_active: true,
      },
    });

    const inactiveMinorCategoriesCount = await this.minorCategoryModel.count({
      where: {
        is_active: false,
      },
    });

    const last10Activities = await this.activityLogModel.findAll({
      limit: 10,
      order: [['created_at', 'DESC']],
      attributes: ['id', 'message', 'method', 'created_at', 'ip_address'],
    });

    const last10Logins = await this.userModel.findAll({
      limit: 10,
      order: [['last_login_at', 'DESC']],
      attributes: ['id', 'name', 'email', 'username', 'last_login_at'],
    });

    return {
      major_categories: {
        active: activeMajorCategoriesCount,
        inactive: inactiveMajorCategoriesCount,
      },
      minor_categories: {
        active: activeMinorCategoriesCount,
        inactive: inactiveMinorCategoriesCount,
      },
      last_10_logins: last10Logins,
      last_10_activities: last10Activities,
    };
  }
}
