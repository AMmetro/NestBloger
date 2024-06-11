import { Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { UsersService } from 'src/features/users/application/users.service';
import { User } from 'src/features/users/api/dto/output/user.output.model';
import { ExtendedSortQueryType } from 'src/base/utils/sortQeryUtils';

@Injectable()
export class SaService {
  constructor(
    private usersRepository: UsersRepository,
    private usersService: UsersService,
  ) {}

  async getAll(sortData: ExtendedSortQueryType): Promise<any> {
    const users = await this.usersRepository.getAll(sortData);
    return users;
  }

  async createUser(
    login: string,
    email: string,
    password: string,
  ): Promise<any> {

    const InputUserModel = {
      login: login,
      password: password,
      email: email,
    };
    const createdUser = await this.usersService.createNewUser(InputUserModel);
    if (!createdUser) {
      return null;
    }
    return User.userWithOutEmailConfirmationMapper(createdUser);
  }

  async deleteAllUsers(): Promise<any> {
    const users = await this.usersRepository.deleteAll();
    return users;
  }

  async deleteUser(userId: string): Promise<any> {
    const isUsersExist = await this.usersRepository.getById(userId);
    if (!isUsersExist) {
      return null;
    }
    const isDelete = await this.usersRepository.deleteUserById(userId);
    return isDelete;
  }
}
