import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AuthService {

  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) { }

  register(createAuthDto: CreateAuthDto) {
    return this.userService.create(createAuthDto);
  }

  async login(loginDto: LoginDto) {
    const data: User = await this.userService.loginUsingUsername(loginDto.username, loginDto.password);

    if (data) {
      const payload = {
        id: data.id,
        username: data.username,
        email: data.email,
        role: data.role
      }

      const accessToken = await this.jwtService.signAsync(payload);

      return { statusCode: HttpStatus.OK, message: 'Login Success', token: accessToken };
    } else {
      throw new UnauthorizedException('Invalid credentials');
    }

  }
}
