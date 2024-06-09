import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/features/users/domain/user.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { Devices } from '../domain/devices.entity';


// https://orkhan.gitbook.io/typeorm/docs/entity-manager-api
@Injectable()
export class DevicesRepository {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  async create(newDevices: any) {
    const divece = new Devices();
    divece.userId = newDevices.userId;
    divece.ip = newDevices.ip;
    divece.title = newDevices.title;
    divece.tokenCreatedAt = newDevices.tokenCreatedAt;
    divece.lastActiveDate = newDevices.lastActiveDate;
    divece.deviceId = newDevices.deviceId;
    try {
      const newDevice = await this.entityManager.create(Devices, divece);
      return this.entityManager.save(divece);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // ждет uuid тоесть стринг и с ним работает 
    public async getById(deviceId: any): Promise<any> {
    try {
      const device = await this.entityManager.findOne(Devices, { where: { deviceId } } );
      if (!device) {
            return null;
      }
      // убрать лишние поля
      // "id": "943ac172-9499-462f-b59d-e3ea722ff87f",
      // "userId": "9a3f88fe-48ae-4743-b2eb-6669d5a4136a",
      // "ip": "::1",
      // "title": "axios/1.3.4",
      // "tokenCreatedAt": "2024-06-07T17:50:00.000Z",
      // "lastActiveDate": "2024-06-07T20:35:20.000Z",
      // "deviceId": "9f586af2-d355-482f-b26e-dbd7c4550390"
             // return Devices.mapper(device);
      return device;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getAll(userId: any) {
    try {
      const devices = await this.entityManager.findAndCount(Devices, {
        select: ['userId', 'title', 'deviceId'], 
        where: {
          userId: userId
        },
    });
      return devices;
      // return PostClass.mapper(post);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async refreshDeviceTokens(
    deviceId: string,
    deviceLastActiveDate: Date,
    tokenCreatedAt: Date,
  ) {

 const updateDevice = await this.entityManager.update(Devices, { deviceId: deviceId }, { lastActiveDate: deviceLastActiveDate, tokenCreatedAt: tokenCreatedAt });
      return !!updateDevice.affected;
  }

  async deleteDeviceById(deviceId: any) {
    try {
        const device = await this.entityManager.delete(Devices, { deviceId: deviceId });
        return {deletedCount: device.affected}
      } catch (e) {
        console.log(e);
        return null;
      }
  }

  async deleteAll() {
    try {
      const result = await this.entityManager.delete(Devices, {});
      return result;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAllOtherDevices(exceptDeviceId: any, userId: any) {
      try {
        // DELETE FROM "devices" WHERE ("userId" = $1 AND "deviceId" != $2) 
        // -- PARAMETERS: ["47a27c06-b598-4ed8-879d-70fb19774e4d","47919084-b2ea-4f6c-8432-ab1348bcc613"]
        const result = await this.entityManager.delete(Devices, {
          userId: userId,
          deviceId: Not(exceptDeviceId)
        });
        return !!result.affected;
      } catch (e) {
        console.log(e);
        return null;
      }
  }

}
