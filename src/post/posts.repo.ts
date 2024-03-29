import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.schema';
import { Post as PostClass } from './posts.types';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  async findById(postId: string): Promise<Post | null> {
    try {
      const post = await this.postModel.findById(postId);
      if (!post) {
        return null;
      }
      return PostClass.mapper(post); 
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findAll(): Promise<any | null> {
    try {
      const posts = await this.postModel.find();
      console.log("posts")
      console.log(posts)
      if (!posts) {
        return null;
      }
      return posts;
      // return PostClass.mapper(post);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async create(newPost): Promise<any | null> {
    try {
      const newPosts = new this.postModel(newPost);
      newPosts.save();
      const mappedPost = PostClass.mapper(newPosts);
      if (!mappedPost) {
        return null;
      }
      return mappedPost;
    } catch (e) {
      console.log(e);
      return null;
    }
  }


}
