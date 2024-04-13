import { WithId, ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
import { JwtService } from '@nestjs/jwt';
import { hashServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { RequestInputUserType } from 'src/features/users/api/dto/input/create-user.input.model';
import { AuthUserInputModel } from '../api/dto/input/auth.input.model';
import { UsersService } from 'src/features/users/application/users.service';
import { DevicesServices } from 'src/features/devices/application/devices.service';
import { User } from '../api/dto/output/user.output.model';
// import { User } from '../users/api/dto/output/user.output.model';
// import { UsersRepository } from '../users/infrastructure/users.repository';
// import { RequestInputUserType } from '../users/api/dto/input/create-user.input.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class AuthService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private devicesServices: DevicesServices,
    private jwtService: JwtService,
  ) {}

  // async create(createUserModel: RequestInputUserType): Promise<any> {
  //   const { login, password, email } = createUserModel;
  //   const passwordSalt = await hashServise.generateSalt();
  //   const passwordHash = await hashServise.generateHash(password, passwordSalt);
  //   const newUserModal = {
  //     login: login,
  //     email: email,
  //     passwordHash: passwordHash,
  //     passwordSalt: passwordSalt,
  //     createdAt: new Date(),
  //     emailConfirmation: {
  //       confirmationCode: randomUUID(),
  //       expirationDate: new Date().toISOString(),
  //       isConfirmed: true,
  //     },
  //   };
  //   const newUserId =
  //     await this.usersRepository.createWithOutConfirmation(newUserModal);
  //   if (!newUserId) {
  //     return null;
  //   }
  //   const createdUser = await this.usersRepository.getById(newUserId);
  //   if (!createdUser) {
  //     return null;
  //   }
  //   return createdUser;
  // }

  async validateUser(authUserData: AuthUserInputModel): Promise<any> {
    const userSearchData = {
      login: authUserData.loginOrEmail,
      email: authUserData.loginOrEmail,
    };

    // return true
    const user: WithId<User> | null =
      await this.usersRepository.getOneByLoginOrEmail(userSearchData);

    if (!user) {
      return null;
    }

    // return User.userMapper(user);


    const userLogInPasswordHash = await hashServise.generateHash(
      authUserData.password,
      user.passwordSalt,
    );

    if (user.passwordHash !== userLogInPasswordHash || !user) {
      return null;
    }
    return User.userMapper(user);
  }


  async signinUser(
    authData: AuthUserInputModel,
    userAgent: string,
    userIp: string,
  ): Promise<any> {
    // const authUsers = await this.validateUser(authData);

    // const payload = {
    //   userLogin: authData.loginOrEmail,
    //   userId: authData._id.toISOString(),
    // };

    // const AccessToken = await this.jwtService.signAsync(payload);
    // const authUsers2 = await this.usersService.checkCredentials(authData);
    // if (!authUsers) {
    //   // return {
    //   //   status: ResultCode.Unauthorised,
    //   //   errorMessage: `Can't login user`,
    //   // };
    // }
    // const twoTokensWithDeviceId = await this.devicesServices.createdDevice(
    //   authUsers,
    //   userAgent,
    //   userIp,
    // );

    // console.log('twoTokensWithDeviceId');
    // console.log(twoTokensWithDeviceId);

    // if (!twoTokensWithDeviceId) {
    //   // return {
    //   //   status: ResultCode.Conflict,
    //   //   errorMessage: `Can't create new session (with devices) for user`,
    //   // };
    // }
  //   return twoTokensWithDeviceId;
  //   // return {
  //   //   status: ResultCode.Success,
  //   //   data: {
  //   //     newAT: twoTokensWithDeviceId.newAT,
  //   //     newRT: twoTokensWithDeviceId.newRT,
  //   //   },
  //   // };
  }
}


