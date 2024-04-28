import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CommentLike } from '../domain/commentLikesTypes';
import { CommentLikeMoongoose } from '../domain/commentLikes.schema';

@Injectable()
export class CommentLikesRepository {
  constructor(
    @InjectModel(CommentLikeMoongoose.name)
    private commentLikeModel: Model<CommentLike>,
  ) {}

  async findComment(id: string): Promise<any | null> {
    // console.log('============newComment=========');
    // console.log(newComment);
    try {
      const comment = await this.commentLikeModel.findById(id);
      // const comment = await this.postCommentModel.find();
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

  async findAllComment(): Promise<any | null> {
    // console.log('============newComment=========');
    // console.log(newComment);
    try {
      const comment = await this.commentLikeModel.find();
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
      // console.log('newComment');
      // console.log(newComment);
      const comment = await this.commentLikeModel.create(newComment);
      // console.log('comment');
      // console.log(comment);
      if (!comment) {
        return null;
      }
      return comment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updLike(updLike: any): Promise<any | null> {
    try {
 
      // const likeId = updLike;

      console.log('updLike');
      console.log(updLike);

      const like = await this.commentLikeModel.updateOne(
        { _id: updLike._id },
        { $set: { myStatus: updLike.myStatus } },
      );
      console.log('SAVED LIKE');
      console.log(like);
      if (!like.modifiedCount) {
        return null;
      }
      return !!like.modifiedCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async countCommentLikes(
    commentId: string,
    myStatus: string,
  ): Promise<any | null> {
    try {
      const likesCount = await this.commentLikeModel.countDocuments({
        commentId: commentId,
        myStatus: myStatus,
      });

      // console.log('============likesCount=========');
      // console.log(likesCount);

      // if (!newestLikes) {
      //   return null;
      // }
      return likesCount;
    } catch (e) {
      console.log(e);
      return null; 
    }
  }

  async findLike(commentId: string, userId: string): Promise<any | null> {
    try {
      // const like2 = await this.commentLikeModel.find({ commentId: commentId });
      const like = await this.commentLikeModel.findOne({
        commentId: commentId,
        userId: userId,
      });
      // if (!newestLikes) {
      //   return null;
      // }

      return like;
    } catch (e) {
      console.log(e);
      return null;
    }
  }


  async deleteAll(): Promise<any | null> {
    try {
      await this.commentLikeModel.deleteMany();
      return true;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

}
