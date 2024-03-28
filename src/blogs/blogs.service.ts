import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog } from './blogs.schema';
import { BlogDto } from './blog.types';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}

  async create(dto: BlogDto): Promise<Blog> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
    const createdBlog = new this.blogModel(newBlog);
    return createdBlog.save();
  }

  async findAll(): Promise<any> {
    const createdBlog = this.blogModel.find();
    return createdBlog;
  }

  async findOne(id: number): Promise<any> {
    const createdBlog = this.blogModel.find({ _id: id });
    return createdBlog;
  }

  async deleteAll(): Promise<any> {
    const isDeleted = await this.blogModel.deleteMany();
    return isDeleted.deletedCount;
  }
}
