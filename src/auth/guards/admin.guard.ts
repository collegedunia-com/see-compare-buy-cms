import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { User } from 'src/interfaces/user.interface';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {

        const request = context.switchToHttp().getRequest<Request>();

        const user = request.user as User;
        
        if (user && user.role === 'admin') {
            return true;
        }

        throw new UnauthorizedException('Access restricted to admins only');
    }
}
