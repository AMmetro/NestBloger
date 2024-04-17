import { BasicStrategy as Strategy } from 'passport-http';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

const basicConstant = { username: 'admin', password: 'qwerty' };

@Injectable()
// ctrl + click Strategy - можно изменить filds - смотреть структуру
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor(/* private authService: AuthService */) {
    super({ passReqToCallback: true });
  }

  async validate(req, username: string, password: string): Promise<any> {
    if (
      basicConstant.username === username &&
      basicConstant.password === password
    ) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
