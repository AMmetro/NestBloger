import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/features/auth/application/auth.service';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { appConfigLocal } from 'src/settings/appConfig';

// // Custom guard
// // https://docs.nestjs.com/guards

@Injectable()
export class OptioanlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      return true;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: appConfigLocal.JWT_ACSS_SECRET_LOCAL,
      });
      request['user'] = payload;
      return true;
    } catch (e) {
      return true;
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
