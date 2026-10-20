import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { Author } from '../authors/models/author.model';
import { BrandSpecification } from '../brands/models/brand-specification.model';
import { Brand } from '../brands/models/brand.model';
import { SavedBlog } from '../blogs/models/saved-blog.model';
import { User } from '../user/models/user.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Author,
      Brand,
      BrandSpecification,
      SavedBlog,
      User,
    ]),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const port = Number(config.get<string>('DB_PORT') ?? '3306');
        if (!Number.isInteger(port) || port < 1 || port > 65535) {
          throw new Error('DB_PORT must be a valid TCP port');
        }

        return {
          dialect: 'mysql',
          host: config.getOrThrow<string>('DB_HOST'),
          port,
          username: config.getOrThrow<string>('DB_USERNAME'),
          password: config.getOrThrow<string>('DB_PASSWORD'),
          database: config.getOrThrow<string>('DB_DATABASE'),
          autoLoadModels: true,
          synchronize: false,
          logging:
            config.get<string>('NODE_ENV') === 'development'
              ? console.log
              : false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
