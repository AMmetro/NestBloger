import { Injectable } from '@nestjs/common';
import { hashServise } from 'src/base/utils/JWTservise';
import { randomUUID } from 'crypto';
import { UsersRepository } from '../infrastructure/users.repository';
import { RequestInputUserType } from '../api/dto/input/create-user.input.model';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createNewUser(createUserModel: RequestInputUserType): Promise<any> {
    const { login, password, email, isConfirmed = true } = createUserModel;
    const passwordSalt = await hashServise.generateSalt();
    const passwordHash = await hashServise.generateHash(password, passwordSalt);
    const newUserModel = {
      login: login,
      email: email,
      passwordHash: passwordHash,
      passwordSalt: passwordSalt,
      createdAt: new Date(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: new Date(),
        isConfirmed: isConfirmed,
      },
    };
    const newUserId = await this.usersRepository.addNewUserToRepo(newUserModel);
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
