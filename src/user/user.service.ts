import { Injectable, ConflictException, HttpException, HttpStatus, UnauthorizedException, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { CreateAuthDto } from 'src/auth/dto/create-auth.dto';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { ChangePasswordDto } from './dto/change-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';

@Injectable()
export class UserService {

  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) { }

  async create(createAuthDto: CreateAuthDto) {

    const { name,username,slug, password, email,is_author_active, role,bio,twitter_url,custom_website_url,facebook_url,avatar,instagram_url } = createAuthDto;

    const existingUsername = await this.findByUsername(username);
    if (existingUsername) {
      throw new ConflictException('Username already exists');
    }

    const existingEmail = await this.findByEmail(email);
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const data = await this.userModel.create({ name,username, slug,password: hashedPassword, email, role ,bio,twitter_url,custom_website_url,facebook_url,avatar,instagram_url,is_author_active});

    if (data) {
      return { statusCode: HttpStatus.CREATED, message: 'User created successfully' };
    } else {
      throw new HttpException('Unable to create user', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async loginUsingUsername(username: string, password: string) {
    const user = await this.findByUsername(username);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    user.last_login_at = new Date();

    user.save();

    return user;
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userModel.findOne({ where: { id } , attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] } });
  }

  async findByUsername(username: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { username , deactivated_at: null } });
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.userModel.findOne({ where: { email } });
  }

  async deactive(id: number) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.deactivated_at = new Date();

    user.save();

    return user;
  }

  async findAll(limit: number, offset: number, username: string, name: string, email: string, role: string) {
    let whereCondition: any = {};

    if (name) {
      whereCondition.name = { [Op.like]: `%${name}%` };
    }
    if (email) {
      whereCondition.email = { [Op.like]: `%${email}%` };
    }

    if (username) {
      whereCondition.username = { [Op.like]: `%${username}%` };
    }

    if (role && ['user', 'admin'].includes(role)) {
      whereCondition.role = role;
  }

    return this.userModel.findAndCountAll({
      limit,
      offset,
      where: whereCondition,
      attributes: {
        exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt']
      },
    });
  }

  async search(search: string) {
    const data = await this.userModel.searchByTitle(search);
    if (data.length) {
      return { statusCode: HttpStatus.OK, data };
    } else {
      throw new NotFoundException(`No user found`);
    }
  }


  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { name,slug, email, username, avatar,is_author_active, role, facebook_url, instagram_url, twitter_url, custom_website_url,bio } = updateUserDto;

    user.name = name;
    user.email = email;
    user.username = username;
    user.avatar = avatar;
    user.facebook_url = facebook_url;
    user.instagram_url = instagram_url;
    user.twitter_url = twitter_url;
    user.custom_website_url = custom_website_url;
    user.role = role;
    user.bio = bio;
    user.is_author_active = is_author_active;
    user.slug = slug;
    user.save();

    return user;
  }

  async changePassword(id: number, changePassword: ChangePasswordDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { current_password, new_password } = changePassword;

    const isPasswordValid = await bcrypt.compare(current_password, user.password);
    
    if (!isPasswordValid) {
      throw new UnprocessableEntityException('Current password does not match');
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;

    user.save();

    return user;
  }

  async changeUserPassword(id: number, changePassword: ChangeUserPasswordDto) {
    const user = await this.userModel.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { new_password } = changePassword;

    const hashedPassword = await bcrypt.hash(new_password, 10);

    user.password = hashedPassword;

    user.save();

    return user;
  }

  async userDetails(id: number) {
    return await this.userModel.findOne({ where: { id }, attributes: { exclude: ['password', 'createdAt', 'updatedAt', 'deletedAt'] } });
  }

}
