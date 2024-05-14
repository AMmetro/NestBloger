// import { WithId, ObjectId } from 'mongodb';
// import { Injectable } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// // import { User } from './users.schema';
// import { hashServise } from 'src/base/utils/JWTservise';
// import { randomUUID } from 'crypto';
// import { UsersSQLRepository } from '../infrastructure/users.repository';
// import { RequestInputUserType } from '../api/dto/input/create-user.input.model';
// import { OutputUserType, User } from '../api/dto/output/user.output.model';
// import { AuthUserInputModel } from 'src/features/auth/api/dto/input/auth.input.model';
// import DatabaseService from 'src/database/postgress/database.service';
// import { Repository } from 'typeorm';
// import { InjectRepository } from '@nestjs/typeorm';
// // import { User } from '../users/api/dto/output/user.output.model';
// // import { UsersRepository } from '../users/infrastructure/users.repository';
// // import { RequestInputUserType } from '../users/api/dto/input/create-user.input.model';

// // Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
// @Injectable()
// export class SaService {
//   constructor(
//     @InjectRepository(UsersSQLRepository)
//     // @InjectModel(User.name) private userModel: Model<User>,
//     // private usersRepository: UsersRepository,
//     // private databaseService: DatabaseService,
//     private usersSQLRepository: Repository<UsersSQLRepository>,
//   ) {}

//   async getAll(createUserModel: any): Promise<any> {
//     // return "helol2"

//     const test = await this.usersSQLRepository.getAll();
//     return test;
//   }
// }

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserSQL } from '../domain/userSQL.entity';

@Injectable()
export class SaService {
  constructor(
    @InjectRepository(UserSQL)
    private usersRepository: Repository<UserSQL>,
  ) {}

  findAll(): Promise<UserSQL[]> {
    return this.usersRepository.find();
  }

  findOne(id: number): Promise<UserSQL | null> {
    return this.usersRepository.findOneBy({ id });
  }

  async remove(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
