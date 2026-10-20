import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './models/user.model';

@Module({
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
  imports: [SequelizeModule.forFeature([User])],

})
export class UserModule {}
