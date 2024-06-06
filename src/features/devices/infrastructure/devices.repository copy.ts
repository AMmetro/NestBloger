import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/features/sa/api/dto/output/user.output.model';
import { DataSource } from 'typeorm';
import { searchDataType } from '../api/dto/input/create-user.input.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

// import {
//   Devices,
//   DevicesDocument,
//   DevicesMongoose,
// } from '../domain/devices.entity';

@Injectable()
export class DevicesRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

// @Injectable()
// export class DevicesRepository {
//   constructor(
//     @InjectModel(DevicesMongoose.name)
//     private devicesModel: Model<DevicesDocument>,
//   ) {}

  async create(newDevices: any): Promise<any | null> {
    // try {
    //   const createdDeviceId = await this.devicesModel.create(newDevices);
    //   return createdDeviceId;
    //   // return PostClass.mapper(post);
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  }

  async getById(deviceId: any): Promise<any | null> {
    // try {
    //   const device = await this.devicesModel.findOne({ deviceId: deviceId });
    //   if (!device) {
    //     return null;
    //   }
    //   return Devices.mapper(device);
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  }

  async getAll(userId: string): Promise<any | null> {
    // try {
    //   const devices = await this.devicesModel.find({ userId: userId });
    //   return devices.map(Devices.allDevicesMapper);
    //   // return device;
    //   // return PostClass.mapper(post);
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  }

  async refreshDeviceTokens(
    deviceId: string,
    deviceLastActiveDate: Date,
    tokenCreatedAt: Date,
  ): Promise<any> {
  //   const updateDevice = await this.devicesModel.updateOne(
  //     { deviceId: deviceId },
  //     {
  //       $set: {
  //         lastActiveDate: deviceLastActiveDate,
  //         tokenCreatedAt: tokenCreatedAt,
  //       },
  //     },
  //   );
  //   return !!updateDevice.modifiedCount;
  }

  async deleteDeviceById(deviceId: any): Promise<any | null> {
    // try {
  //     const device = await this.devicesModel.deleteOne(deviceId);
  //     return device;
  //     // return PostClass.mapper(post);
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  }


  async deleteAll(): Promise<any | null> {
  //   try {
  //     const device = await this.devicesModel.deleteMany();
  //     return device;
  //     // return PostClass.mapper(post);
  //   } catch (e) {
  //     console.log(e);
  //     return null;
    // }
  }

  async deleteAllOtherDevices(
    userId: string,
    deviceId: string
  ): Promise<any | string> {
  //   const deleteDevices = await this.devicesModel.deleteMany({
  //     deviceId: { $ne: deviceId },
  //     userId: userId,
  //   });
  //   return !!deleteDevices.deletedCount; 
  }
}
