import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { Blog } from '../../blogs/models/blog.model';
import { MinorCategory } from '../../minor-category/models/minor-category.model';
import { BrandSpecification } from './brand-specification.model';

@Table({
  tableName: 'brands',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class Brand extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Index({ name: 'uq_brands_minor_slug', unique: true })
  @ForeignKey(() => MinorCategory)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare minorCategoryId: number;

  @BelongsTo(() => MinorCategory, { onDelete: 'RESTRICT' })
  declare minorCategory: MinorCategory;

  @Column({ type: DataType.STRING(160), allowNull: false })
  declare name: string;

  @Index({ name: 'uq_brands_minor_slug', unique: true })
  @Column({ type: DataType.STRING(180), allowNull: false })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.STRING(120), allowNull: true })
  declare price: string | null;

  @Column({ type: DataType.DECIMAL(5, 2), allowNull: true })
  declare expertScore: string | null;

  @Column({ type: DataType.DECIMAL(4, 2), allowNull: true })
  declare overallRating: string | null;

  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: true })
  declare reviewCount: number | null;

  @Column({ type: DataType.STRING(255), allowNull: true })
  declare seoTitle: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare seoDescription: string | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare pros: string[] | null;

  @Column({ type: DataType.JSON, allowNull: true })
  declare cons: string[] | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isActive: boolean;

  @HasMany(() => BrandSpecification)
  declare specifications: BrandSpecification[];

  @HasMany(() => Blog)
  declare blogs: Blog[];

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}
