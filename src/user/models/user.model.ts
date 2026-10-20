import { Op } from 'sequelize';
import { Column, Model, Table, Unique } from 'sequelize-typescript';

export enum UserRole {
    Admin = 'admin',
    User = 'user',
}
@Table({ tableName: 'users', underscored: true, timestamps: true, paranoid: true })

export class User extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column
    name: string;

    @Unique
    @Column
    email: string;

    @Column
    password: string;

    @Column({ type: 'text'})
    bio: string;

    @Column({ type: 'enum', values: ['admin', 'user'], defaultValue: 'user' })
    role: UserRole;

    @Column
    avatar: string;

    @Column
    status: string;

    @Column
    facebook_url: string;

    @Column
    instagram_url: string;

    @Column
    twitter_url: string;

    @Column
    custom_website_url: string;

    @Column
    last_login_at: Date;

    @Unique
    @Column
    username: string;

    @Column
    is_author_active: boolean;

    @Column
    deactivated_at?: Date;

    @Column
    slug: string;

    static async searchByTitle(search: string): Promise<User[] | null> {
        return await User.findAll({
            where: {
                name: {
                    [Op.regexp]: `${search}`
                },
                deactivated_at: {
                    [Op.is]: null
                }
            },
            attributes: [
                ['name', 'title'],
                'id'
            ]
        });
    }
    
}