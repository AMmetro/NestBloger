import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { appSettings } from 'src/settings/app-settings';
const AcsessLogin = appSettings.api.LOGIN;
const AcsessPass = appSettings.api.PASS;

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const auth = req.headers['authorization'];
    if (!auth) {
      res.sendStatus(401);
      return;
    }
    const [basic, token] = auth.split(' ');
    if (basic !== 'Basic') {
      res.sendStatus(401);
      return;
    }
    const decodedToken = Buffer.from(token, 'base64').toString();
    const [login, password] = decodedToken.split(':');
    if (login !== AcsessLogin || password !== AcsessPass) {
      res.sendStatus(401);
      return;
    }
    return next();
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const auth = req.headers['authorization'];
  if (!auth) {
    res.sendStatus(401);
    return;
  }

  const [basic, token] = auth.split(' ');
  if (basic !== 'Basic') {
    res.sendStatus(401);
    return;
  }

  const decodedToken = Buffer.from(token, 'base64').toString();
  const [login, password] = decodedToken.split(':');

  if (login !== AcsessLogin || password !== AcsessPass) {
    res.sendStatus(401);
    return;
  }
  return next();
};
