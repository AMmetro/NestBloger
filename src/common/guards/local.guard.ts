import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// обращается во внутрь LocalStrategy
// через слово "local" видит его т.к. она там импортируется из 'passport-local';
export class LocalAuthGuard extends AuthGuard('local') {}
