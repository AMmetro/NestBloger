import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Blog } from './blogs.schema';
import { Blog as BlogClass } from './blog.types';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogClass>) {}

  async findById(blogId: number): Promise<Blog | null> {
    try {
      const blog = await this.blogModel.findById(blogId);
      return BlogClass.mapper(blog);

    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
