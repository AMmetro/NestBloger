import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
import { hashServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { User } from '../users/api/dto/output/user.output.model';
import { UsersRepository } from '../users/infrastructure/users.repository';

@Injectable()
export class UsersService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    private usersRepository: UsersRepository,
  ) {}

  // findOne(id): any {
  //   return this.userModel.find({ login: id }).exec();
  //   return "h111111111ello"
  // }

  findAll(): any {
    // return this.userModel.find().exec();
    // return "aaaaaaallllllllllllllllllllllllllllllll"
  }

  async create(createUserModel: any): Promise<any> {
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
}

// import { Injectable } from '@nestjs/common';
// import { UsersRepository } from '../infrastructure/users.repository';

// // Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
// @Injectable()
// export class UsersService {
//   constructor(private usersRepository: UsersRepository) {}

//   async create(email: string, name: string) {
//     // email send message
//     // this.emailAdapter.send(message);

//     return 'id';
//   }
// }
