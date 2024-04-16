import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { appSettings } from 'src/settings/app-settings';

// const jwtConstant = { secret: 'very secret' };

@Injectable()
// ctrl + click Strategy - можно изменить filds - смотреть структуру
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: appSettings.api.JWT_ACSS_SECRET,
    });
  }

  async validate(payload: any) {
    console.log('===222222===');
    console.log(payload);

    // const userSearchData = {
    //   loginOrEmail: login,
    //   password: password,
    // };

    // const user = await this.authService.validateUser(userSearchData);
    // if (!user) {
    //   throw new UnauthorizedException();
    // }
    return { userId: payload.sub, userName: payload.username };
  }
}