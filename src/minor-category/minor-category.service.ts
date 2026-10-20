import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Author } from '../authors/models/author.model';
import { Blog } from '../blogs/models/blog.model';
import { MajorCategory } from '../major-category/models/major-category.model';
import { MinorCategory } from './models/minor-category.model';

@Injectable()
export class MinorCategoryService {
  constructor(
    @InjectModel(MajorCategory) private readonly majors: typeof MajorCategory,
    @InjectModel(MinorCategory) private readonly minors: typeof MinorCategory,
    @InjectModel(Blog) private readonly blogs: typeof Blog,
  ) {}

  findAll() {
    return this.minors.findAll({
      where: { isActive: true },
      attributes: ['id', 'name', 'slug', 'description', 'updatedAt'],
      include: [
        {
          model: MajorCategory,
          where: { isActive: true },
          attributes: ['id', 'name', 'slug'],
          required: true,
        },
      ],
      order: [['name', 'ASC']],
    });
  }

  async findOne(majorSlug: string, minorSlug: string) {
    const major = await this.majors.findOne({
      where: { slug: majorSlug, isActive: true },
      attributes: ['id', 'name', 'slug'],
    });
    if (!major) throw new NotFoundException('Major category not found');

    const minor = await this.minors.findOne({
      where: { slug: minorSlug, majorCategoryId: major.id, isActive: true },
      attributes: ['id', 'name', 'slug', 'description', 'updatedAt'],
    });
    if (!minor)
      throw new NotFoundException(
        'Minor category not found under this major category',
      );

    const blogs = await this.blogs.findAll({
      where: {
        majorCategoryId: major.id,
        minorCategoryId: minor.id,
        isActive: true,
      },
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
      limit: 50,
    });

    return {
      major_category_data: major,
      minor_category_data: minor,
      blogs,
    };
  }
}
