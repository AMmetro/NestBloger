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
    try {
      const comment = await this.commentLikeModel.findById(id);
      if (!comment) {
        return null;
      }
      return comment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findUserComment(userId: string, commentId): Promise<any | null> {
    try {
      const comment = await this.commentLikeModel.findOne({
        commentId: commentId,
        userId: userId,
      });
      if (!comment) {
        return null;
      }
      return comment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findAllComment(): Promise<any | null> {
    try {
      const comment = await this.commentLikeModel.find();
      if (!comment) {
        return null;
      }
      return comment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createLike(newComment: any): Promise<any | null> {
    try {
      const comment = await this.commentLikeModel.create(newComment);
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
      const like = await this.commentLikeModel.updateOne(
        { _id: updLike._id },
        { $set: { myStatus: updLike.myStatus } },
      );
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
      return likesCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findLike(commentId: string, userId: string): Promise<any | null> {
    try {
      const like = await this.commentLikeModel.findOne({
        commentId: commentId,
        userId: userId,
      });
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
