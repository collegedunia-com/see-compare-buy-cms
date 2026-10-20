import { Body, Controller, Delete, Get, HttpCode, HttpStatus, NotFoundException, Param, Patch, Post, Query, Req, UnprocessableEntityException, UseGuards, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { FindAllDto } from './dto/find-all-user.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { ChangeUserPasswordDto } from './dto/change-user-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(
    @Query(new ValidationPipe({ transform: true })) findAllDto: FindAllDto
  ) {

    const { limit, offset, name, email, username, role } = findAllDto;

    const data = await this.userService.findAll(limit, offset, username, name, email, role);

    if (!data)
      throw new NotFoundException('No user found');

    return {
      total_count: data.count,
      count: data.rows.length,
      limit: limit,
      offset: offset,
      data: data.rows,
    };
  }

  @Get('search')
  search(@Query('q') search: string) {
    if (!search) {
      throw new UnprocessableEntityException("'q' parameter is required for search.");
    }
    return this.userService.search(search);
  }

  @Get('id/:id')
  async findOneById(@Param('id') id: string) {
    const data = await this.userService.findOneById(+id);

    if (!data)
      throw new NotFoundException('User not found');

    return { statusCode: HttpStatus.OK, data };
  }

  @UseGuards(AdminGuard)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const data = await this.userService.update(+id, updateUserDto);

    if (!data)
      throw new NotFoundException('User not found');

    return { statusCode: HttpStatus.OK, message: 'User updated successfully' };
  }

  @Get('username/:username')
  findOneByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }


  @UseGuards(AdminGuard)
  @Delete('/deactive/:id')
  async deactive(@Param('id') id: string) {
    const data = await this.userService.deactive(+id);

    if (!data)
      throw new NotFoundException('User not found');

    return { statusCode: HttpStatus.OK, message: 'User deleted successfully' };
  }

  @UseGuards(AdminGuard)
  @Post('change-password')
  async chanePassword(@Req() request: any, @Body() changePassword: ChangePasswordDto) {

    const data = await this.userService.changePassword(request.user.id, changePassword);

    if (!data)
      throw new NotFoundException('User not found');

    return { statusCode: HttpStatus.OK, message: 'Password changed successfully' };

  }

  @UseGuards(AdminGuard)
  @Post('change-user-password/:id')
  async chaneUserPassword(@Param('id') id: string, @Body() changeUserPassword: ChangeUserPasswordDto) {

    const data = await this.userService.changeUserPassword(+id, changeUserPassword);

    if (!data)
      throw new NotFoundException('User not found');

    return { statusCode: HttpStatus.OK, message: 'Password changed successfully' };

  }

  @Get('details')
  async userDetails(@Req() request: any) {

    const userId = request.user.id;

    const data = await this.userService.userDetails(+userId);

    if (!data)
      throw new NotFoundException('User not found');

    return { statusCode: HttpStatus.OK, data };

  }

}
