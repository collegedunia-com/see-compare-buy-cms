import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Index,
  Model,
  Table,
} from 'sequelize-typescript';
import { Brand } from './brand.model';

@Table({
  tableName: 'brand_specifications',
  underscored: true,
  timestamps: true,
})
export class BrandSpecification extends Model {
  @Column({
    type: DataType.INTEGER.UNSIGNED,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Index({ name: 'uq_brand_spec_key', unique: true })
  @ForeignKey(() => Brand)
  @Column({ type: DataType.INTEGER.UNSIGNED, allowNull: false })
  declare brandId: number;

  @BelongsTo(() => Brand, { onDelete: 'CASCADE' })
  declare brand: Brand;

  @Index({ name: 'uq_brand_spec_key', unique: true })
  @Column({ type: DataType.STRING(120), allowNull: false })
  declare specKey: string;

  @Column({ type: DataType.TEXT, allowNull: false })
  declare specValue: string;

  @Column({
    type: DataType.INTEGER.UNSIGNED,
    allowNull: false,
    defaultValue: 0,
  })
  declare displayOrder: number;

  declare createdAt: Date;
  declare updatedAt: Date;
}
