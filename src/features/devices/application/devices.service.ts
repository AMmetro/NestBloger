import { WithId, ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
import { jwtServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { OutputUserType } from '../api/dto/output/user.output.model';
import { DevicesMongoose } from '../domain/devices.entity';
import { Model } from 'mongoose';
import { DevicesRepository } from '../infrastructure/devices.repository';
// import { User } from '../users/api/dto/output/user.output.model';
// import { UsersRepository } from '../users/infrastructure/users.repository';
// import { RequestInputUserType } from '../users/api/dto/input/create-user.input.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class DevicesServices {
  constructor(
    @InjectModel(DevicesMongoose.name)
    private devicesModel: Model<DevicesMongoose>,
    private devicesRepository: DevicesRepository,
    // private usersRepository: UsersRepository,
  ) {}

  async createdDevice(
    loginUser: OutputUserType,
    userAgent: string,
    userIp: string,
    // ): Promise<{ newAT: string; newRT: string } | null> {
  ): Promise<any> {
    const newDeviceId = randomUUID();

    const accessToken = await jwtServise.createAccessTokenJWT(
      loginUser,
      newDeviceId,
    );

    // const refreshToken = await jwtServise.createRefreshTokenJWT(
    //   loginUser,
    //   newDeviceId,
    // );

    // const decodedRefreshToken =
    //   await jwtServise.getUserFromRefreshToken(refreshToken);

    // const newDevices = {
    //   userId: loginUser.id,
    //   deviceId: newDeviceId,
    //   ip: userIp,
    //   title: userAgent,
    //   lastActiveDate: new Date(decodedRefreshToken!.exp * 1000),
    //   tokenCreatedAt: new Date(decodedRefreshToken!.iat * 1000),
    // };

    // const createdDeviceId = await this.devicesRepository.create(newDevices);

    //  возможна ошибка при переходе на мангус
    // if (!createdDeviceId) {
    // if (!createdDeviceId._id) {
    //   return null;
    // }
    // // return createdDeviceId.insertedId.toString();
    // return { newAT: accessToken, newRT: refreshToken };
  }
}
