import { Injectable } from '@nestjs/common';
import { WithId, ObjectId } from 'mongodb';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDocument, UserMongoose } from '../domain/user.entity';
import { User } from '../api/models/output/user.output.model';
import { SortDataType } from '../api/models/input/create-user.input.model';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(UserMongoose.name) private userModel: Model<UserDocument>,
  ) {}

  async getAll(sortData: SortDataType): Promise<any> {
    const {
      searchEmailTerm,
      searchLoginTerm,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
    } = sortData;

    let filter = {};
    if (searchEmailTerm) {
      filter = {
        email: {
          $regex: searchEmailTerm,
          $options: 'i',
        },
      };
    }
    if (searchLoginTerm && !searchEmailTerm) {
      filter = {
        login: {
          $regex: searchLoginTerm,
          $options: 'i',
        },
      };
    }
    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
          { email: { $regex: searchEmailTerm, $options: 'i' } },
          { login: { $regex: searchLoginTerm, $options: 'i' } },
        ],
      };
    }
    try {
      const users: WithId<User>[] = await this.userModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();
      const totalCount = await this.userModel.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: users.map(User.userMapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getById(userId: string): Promise<any> {
    try {
      const user = await this.userModel.findById(userId);
      return User.userMapper(user);
    } catch (e) {
      console.log(e);
      return null;
    }
  }


  async createWithOutConfirmation(newUserData: User): Promise<any> {
    try {
      const newUserId = await this.userModel.create(newUserData);
      await newUserId.save();
      return newUserId._id.toString();
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any> {
    try {
      const post = await this.userModel.deleteMany();
      return post;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // public async deleteUserById(userId: string) {
  //   const isDelete = await this.userModel.deleteById(userId);
  //   return isDelete;
  // }

  // public async insert(user: User) {
  //     const result: UserDocument[] = await this.userModel.insertMany(user);
  //     return result[0];
  // }
}
