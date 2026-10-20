import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Brand } from '../../brands/models/brand.model';
import { MajorCategory } from '../../major-category/models/major-category.model';

@Table({
  tableName: 'minor_categories',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class MinorCategory extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @ForeignKey(() => MajorCategory)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare majorCategoryId: number;

  @BelongsTo(() => MajorCategory)
  declare majorCategory: MajorCategory;

  @Column({ type: DataType.STRING(120), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(140), allowNull: false })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => Brand)
  declare brands: Brand[];

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}
