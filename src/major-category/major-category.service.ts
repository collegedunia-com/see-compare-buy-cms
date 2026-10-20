import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from '../authors/models/author.model';
import { Blog } from '../blogs/models/blog.model';
import { MinorCategory } from '../minor-category/models/minor-category.model';
import { MajorCategory } from './models/major-category.model';

@Injectable()
export class MajorCategoryService {
  constructor(
    @InjectModel(MajorCategory) private readonly majors: typeof MajorCategory,
    @InjectModel(MinorCategory) private readonly minors: typeof MinorCategory,
    @InjectModel(Blog) private readonly blogs: typeof Blog,
  ) {}

  findAll() {
    return this.majors.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'slug', 'description', 'updatedAt'],
      order: [['name', 'ASC']],
    });
  }

  async findBySlug(slug: string) {
    const major = await this.majors.findOne({
      where: { slug, isActive: true },
      attributes: ['id', 'name', 'slug', 'description', 'updatedAt'],
    });
    if (!major) throw new NotFoundException('Major category not found');

    const [minorCategories, blogs] = await Promise.all([
      this.minors.findAll({
        where: { majorCategoryId: major.id, isActive: true },
        attributes: ['id', 'name', 'slug', 'description', 'updatedAt'],
        order: [['name', 'ASC']],
      }),
      this.blogs.findAll({
        where: { majorCategoryId: major.id, isActive: true },
        attributes: [
          'id',
          'title',
          'slug',
          'excerpt',
          'coverImageUrl',
          'createdAt',
          'updatedAt',
        ],
        include: [{ model: Author, attributes: ['id', 'name', 'slug'] }],
        order: [['updatedAt', 'DESC']],
        limit: 20,
      }),
    ]);

    return {
      major_category_data: major,
      minor_categories: minorCategories,
      blogs,
    };
  }
}
