import { Column, DataType, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'authors',
  underscored: true,
  timestamps: true,
  paranoid: true,
})
export class Author extends Model {
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
  declare bio: string | null;

  @Column({ type: DataType.STRING(2048), allowNull: true })
  declare avatarUrl: string | null;

  declare createdAt: Date;
  declare updatedAt: Date;
  declare deletedAt: Date | null;
}
