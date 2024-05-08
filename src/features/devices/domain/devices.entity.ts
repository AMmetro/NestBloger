import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export class Devices {
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  tokenCreatedAt: Date;
  deviceId: string;

  static mapper(device): any {
    return {
      ip: device.ip,
      title: device.title,
      userId: device.userId,
      deviceId: device.deviceId,
      lastActiveDate: device.lastActiveDate,
      tokenCreatedAt: device.tokenCreatedAt,
    };
  }
  static allDevicesMapper(device): any {
    return {
      ip: device.ip,
      title: device.title,
      deviceId: device.deviceId,
      lastActiveDate: device.lastActiveDate,
    };
  }
}

export type DevicesDocument = HydratedDocument<DevicesMongoose>;

@Schema()
export class DevicesMongoose {
  @Prop()
  userId: string;
  @Prop()
  ip: string;
  @Prop()
  title: string;
  @Prop()
  lastActiveDate: Date;
  @Prop()
  tokenCreatedAt: Date;
  @Prop()
  deviceId: string;
}

export const DevicesSchema = SchemaFactory.createForClass(DevicesMongoose);
