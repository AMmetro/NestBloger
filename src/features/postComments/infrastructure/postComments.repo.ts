import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PostCommentMoongoose } from '../domain/postsComment.schema';
import { CreateComment } from '../domain/postCommentTypes';

@Injectable()
export class PostCommentsRepository {
  constructor(
    @InjectModel(PostCommentMoongoose.name)
    private PostCommentModel: Model<PostCommentMoongoose>,
  ) {}

  async findComment(id: string): Promise<any | null> {
    // console.log('============newComment========='); 
    // console.log(newComment);
    try {
      const postComment = await this.PostCommentModel.findById(id);
      // const postComment = await this.PostCommentModel.find();
      // console.log('============postId=========');
      // console.log(postId);
      if (!postComment) {
        return null;
      }
      //   return postLikes.map((like) => PostLike.mapper(like));
      return postComment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async create(newComment: any): Promise<any | null> {
    try {
      const postComment = await this.PostCommentModel.create(newComment);
      // console.log('============postId=========');
      // console.log(postId);
      if (!postComment) {
        return null;
      }
      //   return postLikes.map((like) => PostLike.mapper(like));
      return CreateComment.mapper(postComment);
    } catch (e) {
      console.log(e);
      return null;
    }
  }





}
