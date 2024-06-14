import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/features/users/domain/user.entity';
import { EntityManager, Not, Repository } from 'typeorm';
import { Device, Devices } from '../domain/devices.entity';


// https://orkhan.gitbook.io/typeorm/docs/entity-manager-api
@Injectable()
export class DevicesRepository {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  async create(newDevices: Device) {
    const divece = new Devices();
    //* задается значение для внешней ссылки если поле FK задано явно 
    divece.userId = newDevices.userId;
    //* если FK userId поле явно не задано, то в obj {user} нужно пробрасывать значение userId
    //* для создания FK на связанную таблицу 
    //* divece.user = newDevices.userId;
    divece.deviceId = newDevices.deviceId;
    divece.ip = newDevices.ip; 
    divece.title = newDevices.title;
    divece.tokenCreatedAt = newDevices.tokenCreatedAt;
    divece.lastActiveDate = newDevices.lastActiveDate;

    try {
      // const newDevice = await this.entityManager.getRepository(Devices).create(divece).save();
      const newDevice = await this.entityManager.getRepository(Devices).save(divece);
        
      // console.log("=====newDevice=====");
      // console.log(newDevice); 
  
      const allDevic = await this.entityManager.getRepository(Devices).find();
      // console.log("===allDevic==CREATE=");
      // console.log(allDevic);
      //console.log(xxx);

      return newDevice;
  
    } catch (e) {
      console.log(e);
      return null;
    }
  }

    public async getById(deviceId: string): Promise<any> {
    try {
      // const allDevic = await this.entityManager.getRepository(Devices).find();
      const device = await this.entityManager.findOne(Devices, { where: { deviceId } } );
      if (!device) {
            return null;
      }
             // return Devices.mapper(device);
      return device;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  public async getAll(userId: any) {
    try {
      const devices = await this.entityManager.find(Devices, {
        select: ['user', 'ip', 'lastActiveDate', 'title', 'deviceId'], 
        where: {
          user: {id: userId}
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

      console.log("---!!!!!!-----");

        // const device = await this.entityManager.delete(Devices, { deviceId });
        const device = await this.entityManager.getRepository(Devices).delete(deviceId);

        console.log("---device2-----");
        console.log(device);

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

  async deleteAllOtherDevices(data: {userId: string, deviceId: string}) { 
      try {
        // const result = await this.entityManager.delete(Devices, {
        //   userId: userId,
        //   deviceId: Not(exceptDeviceId)


        console.log("--exceptDeviceId");
        console.log(data.deviceId);
        console.log("--userId");
        console.log(data.userId);

        const result = await this.entityManager.getRepository(Devices).delete({
          // userId: data.userId,
          deviceId: Not(data.deviceId)
      
        });

        console.log("-----result---");
        console.log(result);

        // если удалено 0 девайсов но их и не было то ошибка ?
        return !!result.affected; 
      } catch (e) {
        console.log(e);
        return null;
      }
  }

}
