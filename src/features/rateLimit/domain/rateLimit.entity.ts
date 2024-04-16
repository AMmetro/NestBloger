import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RateLimit = {
  ip: string;
  URL: string;
  date: Date;
};

export type RateLimitDocument = HydratedDocument<RateLimitMongoose>;

@Schema()
export class RateLimitMongoose {
  @Prop()
  ip: string;
  @Prop()
  URL: string;
  @Prop()
  date: Date;
}

export const RateLimitSchema = SchemaFactory.createForClass(RateLimitMongoose);
