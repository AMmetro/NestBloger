import { WithId, ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
import { hashServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../infrastructure/users.repository';
import { RequestInputUserType } from '../api/dto/input/create-user.input.model';
import { OutputUserType, User } from '../api/dto/output/user.output.model';
import { AuthUserInputModel } from 'src/features/auth/api/dto/input/auth.input.model';
// import { User } from '../users/api/dto/output/user.output.model';
// import { UsersRepository } from '../users/infrastructure/users.repository';
// import { RequestInputUserType } from '../users/api/dto/input/create-user.input.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    private usersRepository: UsersRepository,
  ) {}

  async create(createUserModel: RequestInputUserType): Promise<any> {
    const { login, password, email } = createUserModel;
    const passwordSalt = await hashServise.generateSalt();
    const passwordHash = await hashServise.generateHash(password, passwordSalt);
    const newUserModal = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: new Date().toISOString(),
        isConfirmed: true,
      },
    };
    const newUserId =
      await this.usersRepository.createWithOutConfirmation(newUserModal);
    if (!newUserId) {
      return null;
    }
    const createdUser = await this.usersRepository.getById(newUserId);
    if (!createdUser) {
      return null;
    }
    return createdUser;
  }




  // async checkCredentials(
  //   authUserData: AuthUserInputModel
  // ): Promise<OutputUserType | null> {
  //   const userSearchData = {
  //     login: authUserData.loginOrEmail,
  //     email: authUserData.loginOrEmail,
  //   };
  //   const user: WithId<User> | null =
  //     await this.usersRepository.getOneByLoginOrEmail(userSearchData);
  //   if (!user) {
  //     return null;
  //   }
  //   const userLogInPasswordHash = await hashServise.generateHash(
  //     authUserData.password,
  //     user.passwordSalt,
  //   );

  //   if (user.passwordHash !== userLogInPasswordHash || !user) {
  //     return null;
  //   }
  //   return User.userMapper(user);
  // }


}
