import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { Blog } from './blogs.schema';
import { Blog as BlogClass, MappedBlogType } from './blog.types';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private blogModel: Model<BlogClass>) {}

  async findById(blogId: number): Promise<MappedBlogType | null> {
    try {
      const blog = await this.blogModel.findById(blogId);
      if (!blog) {
        return null;
      }
      return BlogClass.mapper(blog);
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
