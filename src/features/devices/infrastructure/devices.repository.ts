import { Injectable } from '@nestjs/common';
import { WithId, ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { DevicesDocument, DevicesMongoose } from '../domain/devices.entity';

@Injectable()
export class DevicesRepository {
  constructor(
    @InjectModel(DevicesMongoose.name)
    private devicesModel: Model<DevicesDocument>,
  ) {}

  async create(newDevices: any): Promise<any | null> {
    try {
      const createdDeviceId = await this.devicesModel.create(newDevices);
      return createdDeviceId;
      // return PostClass.mapper(post);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
