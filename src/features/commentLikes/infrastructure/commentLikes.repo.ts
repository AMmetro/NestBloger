import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CommentLike } from '../domain/commentLikesTypes';
import { CommentLikeMoongoose } from '../domain/commentLikes.schema';

@Injectable()
export class CommentLikesRepository {
  constructor(
    @InjectModel(CommentLikeMoongoose.name)
    private postCommentModel: Model<CommentLike>,

    // @InjectModel(Post.name) private postModel: Model<Post>
  ) {}

  async findComment(id: string): Promise<any | null> {
    // console.log('============newComment=========');
    // console.log(newComment);
    try {
      // const comment = await this.postCommentModel.findById(id);
      const comment = await this.postCommentModel.find();
      // console.log('============postId=========');
      // console.log(postId);
      if (!comment) {
        return null;
      }
      //   return postLikes.map((like) => PostLike.mapper(like));
      return comment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createLike(newComment: any): Promise<any | null> {
    try {
      const comment = await this.postCommentModel.create(newComment);
      if (!comment) {
        return null;
      }
      return comment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
