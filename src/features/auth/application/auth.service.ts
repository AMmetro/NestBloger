import { WithId } from 'mongodb';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
import { JwtService } from '@nestjs/jwt';
import { hashServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { RequestInputUserType } from 'src/features/users/api/dto/input/create-user.input.model';
import { AuthUserInputModel } from '../api/dto/input/auth.input.model';
import { UsersService } from 'src/features/users/application/users.service';
import { DevicesServices } from 'src/features/devices/application/devices.service';
import { emailAdaper } from 'src/base/utils/emailAdaper';
import { appConfigLocal } from 'src/settings/appConfig';
import { User } from 'src/features/users/api/dto/output/user.output.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
    private devicesServices: DevicesServices,
    private jwtService: JwtService,
  ) {}

  async validateUser(authUserData: AuthUserInputModel): Promise<any> {
    const userSearchData = {
      login: authUserData.loginOrEmail,
      email: authUserData.loginOrEmail,
    };
    const user: User | null =
      await this.usersRepository.getOneByLoginOrEmail(userSearchData);
    if (!user) {
      return null;
    }
    const userLogInPasswordHash = await hashServise.generateHash(
      authUserData.password,
      user.passwordSalt,
    );
    if (user.passwordHash !== userLogInPasswordHash || !user) {
      return null;
    }
    return User.userWithOutEmailConfirmationMapper(user);
  }

  async getPayloadFromJWT(token: any): Promise<any> {
    const payload = await this.jwtService.verifyAsync(token, {
      secret: appConfigLocal.JWT_ACSS_SECRET_LOCAL,
    });
    return payload;
  }

  async generateAccessAndRefresh(payload: any): Promise<any> {
    const AccessToken = this.jwtService.sign(payload, {
      expiresIn: appConfigLocal.JWT_ACCESS_EXPIRE_LOCAL,
      secret: appConfigLocal.JWT_ACSS_SECRET_LOCAL,
    });
    const RefreshToken = this.jwtService.sign(payload, {
      expiresIn: appConfigLocal.JWT_REFRESH_EXPIRE_LOCAL,
      secret: appConfigLocal.JWT_REFRESH_SECRET_LOCAL,
    });

    return { AccessToken: AccessToken, RefreshToken: RefreshToken };
  }

  async loginUser(
    authData: AuthUserInputModel, 
    userAgent: string,
    userIp: string,
  ): Promise<any> {
    const userSearchData = {
      login: authData.loginOrEmail,
      email: authData.loginOrEmail,
    };
    const user: User | null =
      await this.usersRepository.getOneByLoginOrEmail(userSearchData);
    if (!user) {
      return null;
    }

    const loginedUserPasswordHash = await hashServise.generateHash(
      authData.password,
      user.passwordSalt,
    );

    if (loginedUserPasswordHash !== user.passwordHash) {
      return null;
    }

    const newDeviceId = randomUUID();
    const payload = {
      userId: user.id.toString(),
      deviceId: newDeviceId,
    };
    const newAccessAndRefreshPair =
      await this.generateAccessAndRefresh(payload);
    const decodedRefreshToken = await this.getPayloadFromJWT(
      newAccessAndRefreshPair.RefreshToken,
    );

    const newDevicesModel = {
      userId: decodedRefreshToken.userId,
      deviceId: decodedRefreshToken.deviceId,
      ip: userIp,
      title: userAgent,
      lastActiveDate: new Date(decodedRefreshToken!.exp * 1000),
      tokenCreatedAt: new Date(decodedRefreshToken!.iat * 1000),
    };

    await this.devicesServices.createdDevice(newDevicesModel);
    return newAccessAndRefreshPair;
  }

  async getUserById(userId: string): Promise<any> {
    const user = await this.usersRepository.getById(userId);
    if (!user) {
      return null;
    }
    return User.userAuthMe(user);
  }

  async registrationUserWithConfirmation(
    registrationData: RequestInputUserType,
  ): Promise<any | null> {
    const userWithEmail: User | null =
      await this.usersRepository.getOneByLoginOrEmail({
        login: ' ',
        email: registrationData.email,
      });
    if (userWithEmail) {
      throw new BadRequestException([
        { message: 'email allready exist', field: 'email' },
      ]);
    }
    const userWithLogin: User | null =
      await this.usersRepository.getOneByLoginOrEmail({
        login: registrationData.login,
        email: ' ',
      });
    if (userWithLogin) {
      throw new BadRequestException([
        { message: 'login allready exist', field: 'login' },
      ]);
    }

    const createdUser = await this.usersService.createNewUser(registrationData);
    const emailInfo = {
      email: createdUser.email,
      subject: 'confirm Email',
      code: createdUser.confirmationCode,
    };
    await emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return true;
  }

  async emailResending(email: string): Promise<any | null> {
    const userSearchData = { email: email, login: ' ' }; // search by login " " false for all login
    const userForEmailResending =
      await this.usersRepository.getOneByLoginOrEmail(userSearchData);
    if (!userForEmailResending) {
      throw new BadRequestException([
        { message: 'not found user for email resending', field: 'email' },
      ]);
    }
    const emailIsConfirmed = userForEmailResending?.isConfirmed;
    if (emailIsConfirmed) {
      throw new BadRequestException([
        { message: 'email allready confirmed', field: 'email' },
      ]);
    }

    const newConfirmationCode = randomUUID();
    const codeUpd = await this.usersRepository.updateConfirmationCode(
      userForEmailResending.id,
      newConfirmationCode,
    );
    if (!codeUpd) {
      throw new BadRequestException([
        { message: 'confirmation code not updated', field: 'db save error' },
      ]);
    }
    const emailInfo = {
      email: userForEmailResending.email,
      code: newConfirmationCode,
      subject: 'resending confirmation code',
    };
    emailAdaper.sendEmailRecoveryMessage(emailInfo);
    return true;
  }

  async confirmEmail(code: string): Promise<any> {
    const userForConfirmation =
      await this.usersRepository.getByConfirmationCode(code);
    if (!userForConfirmation) {
      throw new BadRequestException([
        { message: 'user for confirmation not exist', field: 'code' },
      ]);
    }
    if (userForConfirmation.isConfirmed) {
      throw new BadRequestException([
        { message: 'code already confirmed', field: 'code' },
      ]);
    }
    // if (userForConfirmation.expirationDate < new Date()) {
    //   throw new BadRequestException();
    //   // return {
    //   //   status: ResultCode.ClientError,
    //   //   errorMessage: JSON.stringify({
    //   //     errorsMessages: [
    //   //       { message: `Confirmation code ${code} expired`, field: 'code' },
    //   //     ],
    //   //   }),
    //   // };
    // }
    const isConfirmed = await this.usersRepository.confirmRegistration(
      userForConfirmation.id,
    );
    if (!isConfirmed) {
      return null;
      // return {
      //   status: ResultCode.Conflict,
      //   errorMessage: `Confirmation code ${code}`,
      // };
    }
    return true;
  }

  async logout(userId: string, deviceId: string): Promise<any> {
    const claimantInfo = await this.usersRepository.getById(userId);
    if (!claimantInfo?.id) {
      return null;
    }
    const device = await this.devicesServices.getDevice(deviceId);
    if (!device) {
      return null;
    }
    if (device.userId !== claimantInfo.id.toString()) {
      return null;
      // status: ResultCode.Forbidden,
      // errorMessage: "Try to delete the deviceId of other user",
    }
    const isDeleted = await this.devicesServices.deleteDeviceById(
      deviceId,
      userId,
    );
    if (!isDeleted) {
      null;
    }
    return isDeleted;
  }

  async refreshToken(userId: string, deviceId: string): Promise<any> {
    const user = await this.usersRepository.getById(userId);
    if (!user) {
      return null;
    }
    const device = await this.devicesServices.getDevice(deviceId);
    if (!device) {
      return null;
    }
    const payload = {
      userId: user.id,
      deviceId: deviceId,
    };

    const newAccessAndRefreshPair =
      await this.generateAccessAndRefresh(payload);

    const decodedRefreshToken = await this.getPayloadFromJWT(
      newAccessAndRefreshPair.RefreshToken,
    );

    const deviceLastActiveDate = new Date(decodedRefreshToken!.exp * 1000);
    const tokenCreatedAt = new Date(decodedRefreshToken!.iat * 1000);

    const deviceUpdate = await this.devicesServices.updateDevicesTokens(
      deviceId,
      deviceLastActiveDate,
      tokenCreatedAt,
    );
    if (!deviceUpdate) {
      return null;
    }
    return newAccessAndRefreshPair;
    // if (deviceUpdate.status !== ResultCode.Success) {
    //   return {
    //     status: ResultCode.ServerError,
    //     errorMessage: `Can't update devices lastActiveDate field`,
    //   };
    // }
    // return {
    //   status: ResultCode.Success,
    //   data: { newAccessToken, newRefreshToken },
    // };
  }
}
