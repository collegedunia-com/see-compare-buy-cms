import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Author } from '../authors/models/author.model';
import { Blog } from '../blogs/models/blog.model';
import { MajorCategory } from '../major-category/models/major-category.model';
import { MinorCategory } from '../minor-category/models/minor-category.model';

const summaryAttributes = [
  'id',
  'title',
  'slug',
  'excerpt',
  'coverImageUrl',
  'createdAt',
  'updatedAt',
];
const newestFirst: [string, string][] = [
  ['createdAt', 'DESC'],
  ['id', 'DESC'],
];

@Injectable()
export class JournalService {
  constructor(
    @InjectModel(MajorCategory) private readonly majors: typeof MajorCategory,
    @InjectModel(Blog) private readonly blogs: typeof Blog,
  ) {}

  async landing() {
    const [majors, counts, latestBlogs] = await Promise.all([
      this.majors.findAll({
        where: { isActive: true },
        attributes: ['id', 'name', 'slug'],
        order: [['name', 'ASC']],
      }),
      this.blogs.count({
        where: { isActive: true },
        group: ['majorCategoryId'],
      }),
      this.blogs.findAll({
        where: { isActive: true },
        attributes: summaryAttributes,
        include: [
          {
            model: MajorCategory,
            where: { isActive: true },
            attributes: ['id', 'name', 'slug'],
            required: true,
          },
          { model: Author, attributes: ['id', 'name', 'slug'] },
        ],
        order: newestFirst,
        limit: 10,
      }),
    ]);
    const countByCategory = new Map(
      counts.map((row) => [Number(row.majorCategoryId), Number(row.count)]),
    );
    return {
      categories: majors.map((major) => ({
        id: major.id,
        name: major.name,
        slug: major.slug,
        article_count: countByCategory.get(major.id) ?? 0,
      })),
      latest_blogs: latestBlogs,
    };
  }

  async category(categorySlug: string, page: number, limit: number) {
    const category = await this.findCategory(categorySlug);
    const { rows, count } = await this.blogs.findAndCountAll({
      where: { majorCategoryId: category.id, isActive: true },
      attributes: summaryAttributes,
      include: [{ model: Author, attributes: ['id', 'name', 'slug'] }],
      order: newestFirst,
      limit,
      offset: (page - 1) * limit,
    });
    return {
      category,
      blogs: rows,
      pagination: {
        page,
        limit,
        total: count,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async article(categorySlug: string, articleSlug: string) {
    const category = await this.findCategory(categorySlug);
    const article = await this.blogs.findOne({
      where: {
        majorCategoryId: category.id,
        slug: articleSlug,
        isActive: true,
      },
      include: [
        {
          model: Author,
          attributes: ['id', 'name', 'slug', 'bio', 'avatarUrl'],
        },
        { model: MinorCategory, attributes: ['id', 'name', 'slug'] },
      ],
    });
    if (!article) throw new NotFoundException('Journal article not found');

    const relatedBlogs = await this.blogs.findAll({
      where: {
        majorCategoryId: category.id,
        isActive: true,
        id: { [Op.ne]: article.id },
      },
      attributes: summaryAttributes,
      order: newestFirst,
      limit: 3,
    });
    return { category, article, related_blogs: relatedBlogs };
  }

  private async findCategory(slug: string): Promise<MajorCategory> {
    const category = await this.majors.findOne({
      where: { slug, isActive: true },
      attributes: ['id', 'name', 'slug', 'description'],
    });
    if (!category) throw new NotFoundException('Journal category not found');
    return category;
  }
}
