import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './users.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  findOne(id): any {
    return this.userModel.find({ login: id }).exec();
    return "h111111111ello"
  }

  findAll(): any {
    return this.userModel.find().exec();
    // return "aaaaaaallllllllllllllllllllllllllllllll"
  }

  async create(dto): Promise<any> {
    const createdUser = new this.userModel(dto);
    return createdUser.save();
  }

}

