import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CreateAuthDto } from '../dto/create-auth.dto';

export function ApiCreateAccount(): MethodDecorator {
  return applyDecorators(
    ApiOperation({
      summary: 'Create a new user account',
      description: 'This endpoint creates a new user account.',
    }),
    ApiResponse({
      status: 201,
      description: 'User account created successfully.',
    }),
    ApiResponse({
      status: 400,
      description: 'Bad request. Please check the request body.',
    }),
    ApiBody({
      type: CreateAuthDto,
      description: 'User account details',
    }),
  );
}
