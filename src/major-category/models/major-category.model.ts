import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { MinorCategory } from '../../minor-category/models/minor-category.model';

@Table({
  tableName: 'major_categories',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class MajorCategory extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({ type: DataType.STRING(120), allowNull: false })
  declare name: string;

  @Column({ type: DataType.STRING(140), allowNull: false, unique: true })
  declare slug: string;

  @Column({ type: DataType.TEXT, allowNull: true })
  declare description: string | null;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: true })
  declare isActive: boolean;

  @HasMany(() => MinorCategory)
  declare minorCategories: MinorCategory[];

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}
