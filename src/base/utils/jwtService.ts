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
import { DevicesRepository } from 'src/features/devices/infrastructure/devices.repository';

// // Custom guard
// // https://docs.nestjs.com/guards
// @Injectable()
// export class AuthGuard implements CanActivate {
//   constructor(private readonly authService: AuthService) {}
//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
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
export class CookiesJwtAuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private devicesRepository: DevicesRepository,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);

                                                              console.log("-------token---------");
                                                              console.log(token);


    if (!token) {
      throw new UnauthorizedException();
      // если возвращать false то ошибка будет 403
      // return false;
    }
    try {
      // только достать paylodad из токена -> decode
      // const test = this.jwtService.decode(token)
      const payload = await this.jwtService.verifyAsync(token, {
        secret: appConfigLocal.JWT_ACSS_SECRET_LOCAL,
      });

                                            console.log("--------payload-------");
                                            console.log(payload);

      const deviceId = payload.deviceId;
      // const isDevice = await this.devicesRepository.find({
      //   deviceId: deviceId,
      // });
      const isDevice = await this.devicesRepository.getById(deviceId);

                                                  console.log("-----isDevice---------");
                                                  console.log(isDevice);

      if (!isDevice) {
        throw new UnauthorizedException();
      }

      const tokenIAT = new Date(payload.iat * 1000);

      if (tokenIAT.toISOString() !== isDevice.tokenCreatedAt.toISOString()) {
        throw new UnauthorizedException();
      }
      request['user'] = payload;
      return true;
    } catch (e) {
      // если возвращать false то ошибка будет 403
      // return false;
      throw new UnauthorizedException();
    }
  }

  private extractTokenFromCookies(request: Request): string | undefined {
    const token = request.cookies.refreshToken;
    return token;
  }
}
