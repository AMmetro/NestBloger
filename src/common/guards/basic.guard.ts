import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
// обращается во внутрь LocalStrategy
// через слово "basic" видит его т.к. она там импортируется из 'passport-basic';
export class BasicAuthGuard extends AuthGuard('basic') {}
