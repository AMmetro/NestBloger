import { WithId, ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
// import { jwtServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { OutputUserType } from '../api/dto/output/user.output.model';
// import { DevicesMongoose } from '../domain/devices.entity';
import { Model } from 'mongoose';
import { DevicesRepository } from '../infrastructure/devices.repository';
@Injectable()
export class DevicesServices {
  constructor(
    // @InjectModel(DevicesMongoose.name)
    // @InjectModel()
    // private devicesModel: Model<DevicesMongoose>,
    private devicesRepository: DevicesRepository,
    // private usersRepository: UsersRepository,
  ) {}

  async createdDevice(newDevicesModel: any): Promise<any> {
    const createdDevice = await this.devicesRepository.create(newDevicesModel);

    console.log("===createdDevice====");
    console.log(createdDevice);


    return createdDevice;
  }

  async deleteAllOtherDevices(
    userId: string,
    deviceId: string,
  ): Promise<any | string> {
    const deleteDevices = await this.devicesRepository.deleteAllOtherDevices(
      userId,
      deviceId,
    );

    if (!deleteDevices) {
      return null;
    }
    // return {
    //   status: ResultCode.NotFound,
    //   errorMessage: "Cant find devices for delete",
    // };
    return deleteDevices;
  }
  // return {
  //   status: ResultCode.Success,
  //   data: true,
  // };

  async getDevice(
    deviceId: string,
    // ): Promise<{ newAT: string; newRT: string } | null> {
  ): Promise<any> {
    const device = await this.devicesRepository.getById(deviceId);
    return device;
  }

  async updateDevicesTokens(
    deviceId: string,
    deviceLastActiveDate: Date,
    tokenCreatedAt: Date,
  ): Promise<any | string> {
    const updateDevices = await this.devicesRepository.refreshDeviceTokens(
      deviceId,
      deviceLastActiveDate,
      tokenCreatedAt,
    );
    if (!updateDevices) {
      return null;
      // status: ResultCode.NotFound,
      // errorMessage: "Cant update devices lastActiveDate field",
    }
    return true;
    // status: ResultCode.Success,
    // data: true,
  }

  async deleteDeviceById(deviceId: string, userId: string): Promise<any> {
    const device = await this.devicesRepository.getById(deviceId);
    if (!device?.deviceId) {
      return null;
    }
    if (device.userId != userId) {
      return null;
    }

    const isDelete = await this.devicesRepository.deleteDeviceById({
      deviceId: deviceId,
    });
    return !!isDelete.deletedCount;
  }
}
