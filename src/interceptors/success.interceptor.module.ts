import { Module } from '@nestjs/common';
import { SuccessInterceptor } from './success.interceptor';

@Module({
  providers: [SuccessInterceptor],
  exports: [SuccessInterceptor],
})
export class SuccessInterceptorModule {}
