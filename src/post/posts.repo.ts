import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.schema';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
  // constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}
  constructor() {}

  // async create(newBlog: any): Promise<string | null> {
  //   try {
  //     const post = await this.postModel.create(newBlog);
  //     return post._id.toString();
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }
}
