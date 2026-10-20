import { Column, Model, Table,Unique } from 'sequelize-typescript';

@Table({ tableName: 'activity_logs', underscored: true, timestamps: true })

export class ActivityLog extends Model {
    @Column({ primaryKey: true, autoIncrement: true })
    id: number;

    @Column
    body: string;

    @Column
    message: string;

    @Column
    method: string;

    @Column
    url: string;

    @Column
    ip_address: string;
}