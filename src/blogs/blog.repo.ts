import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { BlogMongoose } from './blogs.schema';
import { Blog, MappedBlogType } from './blog.types';
import { ObjectId } from 'mongodb';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(BlogMongoose.name) private blogModel: Model<Blog>) {}

  async findById(blogId: string): Promise<MappedBlogType | null> {
    try {
      const blog = await this.blogModel.findById(blogId);
      if (!blog) {
        return null;
      }
                                                // console.log("blog")
                                                // console.log(blog)
                                                // console.log("mapper")
                                                // console.log(Blog.mapper(blog))
      return Blog.mapper(blog);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async update(updatedBlogId: string, updatedBlogData: any): Promise<boolean> {
    try {
      const blogForUpd = await this.blogModel.updateOne(
        { _id: new ObjectId(updatedBlogId) },
        {
          $set: {
            name: updatedBlogData.name,
            description: updatedBlogData.description,
            websiteUrl: updatedBlogData.websiteUrl,
          },
        },
      );
      return !!blogForUpd.matchedCount;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  async getAllByName(sortData: any): Promise<any | null> {
    const { searchNameTerm, sortBy, sortDirection, pageNumber, pageSize } =
      sortData;
    let filter = {};
    if (searchNameTerm) {
      filter = {
        name: {
          $regex: searchNameTerm,
          $options: 'i',
        },
      };
    }
    try {
      const blogs = await this.blogModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const totalCount = await this.blogModel.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);
      return {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: blogs.map(Blog.mapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteById(blogId: string): Promise<boolean | null> {
    try {
      const isDeleted = await this.blogModel.deleteOne({
        _id: new ObjectId(blogId),
      });
      return !!isDeleted.deletedCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }





}
