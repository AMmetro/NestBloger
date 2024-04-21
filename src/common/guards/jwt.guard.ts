import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// обращается во внутрь JwtStrategy
// через слово "local" видит его т.к. она там импортируется из 'passport-jwt';
export class JwtAuthGuard extends AuthGuard('jwt') {}
