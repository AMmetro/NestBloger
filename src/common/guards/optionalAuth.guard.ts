import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from 'src/features/auth/application/auth.service';

import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { appConfigLocal } from 'src/settings/appConfig';

// // Custom guard
// // https://docs.nestjs.com/guards
// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();

//     console.log("ttttttttttttttttttttt");

//     // return false;
//     // throw new UnauthorizedException();

//     if (request.query['token'] !== '123') {
//       // Если нужно выкинуть custom ошибку с кодом 401
//       // throw new UnauthorizedException();

//       // default error 403
//       return false;
//     }

//     return true;
//   }
// }

@Injectable()
export class OptioanlAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    // const optionalToken = token || 'abc';
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
