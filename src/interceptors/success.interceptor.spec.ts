import {
  Controller,
  INestApplication,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { SuccessInterceptor } from './success.interceptor';

@Controller('items')
class TestController {
  @Post()
  @UseInterceptors(SuccessInterceptor)
  create() {
    return { id: 1 };
  }
}

describe('SuccessInterceptor', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [TestController],
      providers: [SuccessInterceptor],
    }).compile();

    app = module.createNestApplication();
    await app.init();
  });

  afterAll(async () => app.close());

  it('keeps the real 201 status in the response body', async () => {
    const response = await request(app.getHttpServer())
      .post('/items')
      .expect(201);

    expect(response.body).toEqual(
      expect.objectContaining({ statusCode: 201, data: { id: 1 } }),
    );
  });
});
