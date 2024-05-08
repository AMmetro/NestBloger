import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../application/auth.service';
import { appSettings } from 'src/settings/app-settings';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { appConfigLocal } from 'src/settings/appConfig';

@Injectable()
// ctrl + click Strategy - можно изменить filds - смотреть структуру
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // secretOrKey: appSettings.api.JWT_ACSS_SECRET,
      secretOrKey: appConfigLocal.JWT_ACSS_SECRET_LOCAL,
    });
  }

  async validate(payload: any) {
    const user = await this.usersRepository.getById(payload.userId);
    if (!user) {
      throw new UnauthorizedException();
    }
    //**
    //* payload складывает значения в объект user {}
    //**
    return { userId: payload.userId };
  }
}
