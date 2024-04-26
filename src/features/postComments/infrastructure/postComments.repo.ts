import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PostCommentMoongoose } from '../domain/postsComment.schema';

@Injectable()
export class PostCommentsRepository {
  constructor(
    @InjectModel(PostCommentMoongoose.name)
    private PostCommentModel: Model<PostCommentMoongoose>,
  ) {}

  async create(newComment: any): Promise<any | null> {
    try {
      const postComment = await this.PostCommentModel.create({ newComment });
      // console.log('============postId=========');
      // console.log(postId);
      console.log('============postComment=========');
      console.log(postComment);
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
}
