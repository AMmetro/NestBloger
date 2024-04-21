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
import { User } from '../api/dto/output/user.output.model';
import { add } from 'date-fns/add';
import { emailAdaper } from 'src/base/utils/emailAdaper';
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

    const user: WithId<User> | null =
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
    return User.userMapper(user);
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
    const user: WithId<User> | null =
      await this.usersRepository.getOneByLoginOrEmail(userSearchData);
    if (!user) {
      return null;
    }

    const payload = {
      userId: user._id.toString(),
    };
    const AccessToken = this.jwtService.sign(payload, {
      expiresIn: '3600s',
      secret: '123',
    });
    const RefreshToken = this.jwtService.sign(payload, {
      expiresIn: '9900s',
      secret: '456',
    });

    return { AccessToken: AccessToken, RefreshToken: RefreshToken };

    // const twoTokensWithDeviceId = await this.devicesServices.createdDevice(
    //   authUsers,
    //   userAgent,
    //   userIp,
    // );

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

  async registrationUserWithConfirmation(
    registrationData: RequestInputUserType,
  ): Promise<any | null> {
    const { login, password, email } = registrationData;
    const userWithEmail: WithId<User> | null =
      await this.usersRepository.getOneByLoginOrEmail({
        login: ' ',
        email: email,
      });
    if (userWithEmail) {
      throw new BadRequestException([
        { message: 'email allready exist', field: 'email' },
      ]);
    }
    const userWithLogin: WithId<User> | null =
      await this.usersRepository.getOneByLoginOrEmail({
        email: ' ',
        login: login,
      });
    if (userWithLogin) {
      throw new BadRequestException([
        { message: 'login allready exist', field: 'login' },
      ]);
    }

    const passwordSalt = await hashServise.generateSalt();
    const passwordHash = await hashServise.generateHash(password, passwordSalt);

    const newUser = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      blackListToken: [],
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
        isConfirmed: false,
      },
    };
    const newUserId = await this.usersRepository.createUser(newUser);
    if (!newUserId) {
      return null;
    }
    const emailInfo = {
      email: newUser.email,
      subject: 'confirm Email',
      code: newUser.emailConfirmation.confirmationCode,
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
    const emailIsConfirmed =
      userForEmailResending.emailConfirmation?.isConfirmed;
    if (emailIsConfirmed) {
      throw new BadRequestException([
        { message: 'email allready confirmed', field: 'email' },
      ]);
    }

    const newConfirmationCode = randomUUID();
    const codeUpd = await this.usersRepository.updateConfirmationCode(
      userForEmailResending._id,
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
    if (userForConfirmation.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        { message: 'code already confirmed', field: 'code' },
      ]);
    }
    // if (userForConfirmation.emailConfirmation.expirationDate < new Date()) {
    //   return {
    //     status: ResultCode.ClientError,
    //     errorMessage: JSON.stringify({
    //       errorsMessages: [
    //         { message: `Confirmation code ${code} expired`, field: 'code' },
    //       ],
    //     }),
    //   };
    // }
    const isConfirmed = await this.usersRepository.confirmRegistration(
      userForConfirmation.id,
    );
    if (!isConfirmed) {
      // return {
      //   status: ResultCode.Conflict,
      //   errorMessage: `Confirmation code ${code}`,
      // };
    }
    return true;
  }
}
