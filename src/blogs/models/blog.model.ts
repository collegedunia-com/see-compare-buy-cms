import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { Author } from '../../authors/models/author.model';
import { Brand } from '../../brands/models/brand.model';
import { MajorCategory } from '../../major-category/models/major-category.model';
import { MinorCategory } from '../../minor-category/models/minor-category.model';

@Table({
  tableName: 'blogs',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class Blog extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => Author)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare authorId: number;

  @BelongsTo(() => Author)
  declare author: Author;

  @ForeignKey(() => MajorCategory)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare majorCategoryId: number;

  @BelongsTo(() => MajorCategory)
  declare majorCategory: MajorCategory;

  @ForeignKey(() => MinorCategory)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: true })
  declare minorCategoryId: number | null;

  @BelongsTo(() => MinorCategory)
  declare minorCategory: MinorCategory | null;

  @ForeignKey(() => Brand)
  @Index('idx_blogs_brand_id')
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: true })
  declare brandId: number | null;

  @BelongsTo(() => Brand, { onDelete: 'SET NULL' })
  declare brand: Brand | null;

  @Column({ type: DataType.STRING(255), allowNull: false })
  declare title: string;

  @Column({ type: DataType.STRING(180), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare excerpt: string | null;

  @Column({ type: DataType.TEXT('long'), allowNull: false })
  declare content: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare toc: string | null;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare additional_content: string | null;

  @Column({ type: DataType.STRING(2048), allowNull: true })
  declare coverImageUrl: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  declare isActive: boolean;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}
