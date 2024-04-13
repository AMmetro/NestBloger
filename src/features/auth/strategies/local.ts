import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';


@Injectable()
// ctrl + click Strategy - можно изменить filds - смотреть структуру
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super(
      // переопределить filds т.к. изначально ждет username и password:
      { usernameField: 'login' },
    );
  }

  async validate(login: string, password: string): Promise<any> {
    console.log("===username===") 
    console.log(login);
    console.log("===password===") 
    console.log(password);

    const userSearchData = {
      loginOrEmail: login,
      password: password,
    };

    const user = await this.authService.validateUser(userSearchData);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}