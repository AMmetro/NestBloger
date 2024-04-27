import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { PostLikeMoongoose } from './postsLikes.schema';
import { CommentLikesRepository } from '../infrastructure/commentLikes.repo';
import { PostLikeMoongoose } from 'src/features/postLikes/domain/postsLikes.schema';

@Injectable()
export class CommentLikesServices {
  constructor(
    @InjectModel(PostLikeMoongoose.name)
    private commentLikesRepository: CommentLikesRepository,
  ) {}

  async addLikeToComment(
    commentId: string,
    sendedLikeStatus: string,
    userId: string,
  ): Promise<any> {
    const existingLikeForComment =
      await this.commentLikesRepository.findComment(commentId);
    if (!existingLikeForComment) {
      return null;
    }
    const newLike = {
      commentId: commentId,
      userId: userId,
      myStatus: sendedLikeStatus,
      addedAt: new Date(),
    };
    if (!existingLikeForComment) {
      const newLikeForComment =
        await this.commentLikesRepository.createLike(newLike);

      if (newLikeForComment.myStatus === sendedLikeStatus) {
        return newLike;
      }
      newLikeForComment.myStatus = sendedLikeStatus;
      await newLikeForComment.save();
      return newLikeForComment;
    }

    return newLike;
  }

  // async addLikeToPost(
  //   postId: string,
  //   userId: string,
  //   sendedLikeStatus: string,
  // ): Promise<any> {
  //   // const existingLikeForPost = await this.postLikesModel.findOne({
  //   //   postId: postId,
  //   //   userId: userId,
  //   // });
  //   // const newLike = {
  //   //   postId: postId,
  //   //   userId: userId,
  //   //   myStatus: sendedLikeStatus,
  //   //   addedAt: new Date(),
  //   // };

  //   if (!existingLikeForPost) {
  //     const LikeInstance = new this.postLikesModel(newLike);
  //     LikeInstance.save();
  //     return newLike;
  //   }
  //   if (existingLikeForPost.myStatus === sendedLikeStatus) {
  //     return newLike;
  //   }
  //   existingLikeForPost.myStatus = sendedLikeStatus;
  //   await existingLikeForPost.save();

  //   // const xxx = await this.postLikesModel.find()

  //   // console.log("=======xxx=======")
  //   // console.log(xxx)

  //   // newLike.myStatus = sendedLikeStatus;
  //   return newLike;
  // }
}
