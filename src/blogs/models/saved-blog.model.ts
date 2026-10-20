import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { User } from '../../user/models/user.model';
import { Blog } from './blog.model';

@Table({ tableName: 'saved_blogs', underscored: true, timestamps: false })
export class SavedBlog extends Model {
  @ForeignKey(() => User)
  @Column({ type: DataType.INTEGER.UNSIGNED, primaryKey: true })
  declare userId: number;

  @BelongsTo(() => User)
  declare user: User;

  @ForeignKey(() => Blog)
  @Column({ type: DataType.INTEGER.UNSIGNED, primaryKey: true })
  declare blogId: number;

  @BelongsTo(() => Blog)
  declare blog: Blog;

  @Column({
    type: DataType.DATE(3),
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  declare createdAt: Date;
}
