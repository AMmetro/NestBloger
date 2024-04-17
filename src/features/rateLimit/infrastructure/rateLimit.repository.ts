import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import {
  RateLimitDocument,
  RateLimitMongoose,
} from '../domain/rateLimit.entity';

@Injectable()
export class RateLimitRepository {
  constructor(
    @InjectModel(RateLimitMongoose.name)
    private rateLimitModel: Model<RateLimitDocument>,
  ) {}

  async create(newRequest: any): Promise<any | null> {
    try {
      const createdDeviceId = await this.rateLimitModel.create(newRequest);

      return createdDeviceId;
      // return PostClass.mapper(post);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async countRate(URL: string, ip: string): Promise<any | null> {
    try {
      const count = await this.rateLimitModel.countDocuments({
        URL: URL,
        ip: ip,
        date: { $gte: new Date(Date.now() - 10000) },
      });
      return count;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
