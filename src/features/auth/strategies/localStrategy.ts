import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';

@Injectable()
// ctrl + click Strategy - можно изменить filds - смотреть структуру
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super(
      // переопределить filds т.к. изначально ждет username и password:
      { usernameField: 'loginOrEmail' },
    );
  }
  async validate(loginOrEmail: string, password: string): Promise<any> {
    const userValidateData = {
      loginOrEmail: loginOrEmail,
      password: password,
    };
    const user = await this.authService.validateUser(userValidateData);
    if (!user) {
      throw new UnauthorizedException();
    }
    return true;
  }
}
