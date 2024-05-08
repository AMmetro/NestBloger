//**
//* In NEST MAY USE TROTLER:
//* https://www.npmjs.com/package/@nestjs/throttler
//**

import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { RateLimitRepository } from 'src/features/rateLimit/infrastructure/rateLimit.repository';

// https://docs.nestjs.com/middleware
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  constructor(private rateLimitRepository: RateLimitRepository) {}
  async use(req: Request, res: Response, next: NextFunction) {
    // console.log('Request... in RATE LIMIT');

    const URL = req.originalUrl;
    const ip = req.ip || 'unknown';
    const date = new Date();
    const requesterInfo = { ip: ip, URL: URL, date: date };
    await this.rateLimitRepository.create(requesterInfo);

    const logger = await this.rateLimitRepository.countRate(URL, ip);
    if (logger > 5) return res.sendStatus(429);
    return next();
  }
}
