import { config } from 'dotenv';
import { Sequelize } from 'sequelize';
config();

const wp_sequelize = new Sequelize({
    dialect: 'mysql',
    host: process.env.WP_DB_HOST || 'localhost',
    port: parseInt(process.env.WP_DB_PORT, 10) || 3306,
    username: process.env.WP_DB_USERNAME || 'root',
    password: process.env.WP_DB_PASSWORD || '',
    database: process.env.WP_DB_DATABASE || 'your_database',
});

export { wp_sequelize };
