import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.types';
import { Blog } from 'src/blogs/blog.types';
import { PostRepository } from './posts.repo';
import { BlogRepository } from 'src/blogs/blog.repo';
import { createPostDTO } from 'src/blogs/blog.types';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private postRepository: PostRepository,
    private blogRepository: BlogRepository,
  ) {}

  async createPost(blogId: number, reqData: createPostDTO) {
    const currentBlog: Blog = await this.blogRepository.findById(blogId);
                                    // console.log("currentBlog")
                                    // console.log(currentBlog)
    if (!currentBlog) {
      return null;
    }
    const newPost = {
      title: reqData.title,
      shortDescription: reqData.shortDescription,
      content: reqData.content,
      blogName: currentBlog.name,
      // @ts-ignore
      blogId: currentBlog.id,
      createdAt: new Date(),
    };
    // нужно в репозитории
    const createdPost = new this.postModel(newPost);
    createdPost.save();
    return createdPost;
  }

  // async findAll(): Promise<any> {
  //   const createdBlog = this.blogModel.find();
  //   return createdBlog;
  // }

  // async findOne(id: number): Promise<any> {
  //   const createdBlog = this.blogModel.find({ _id: id });
  //   return createdBlog;
  // }

  // async deleteAll(): Promise<any> {
  //   const isDeleted = await this.blogModel.deleteMany();
  //   return isDeleted.deletedCount;
  // }
}
