import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { PostLikeMoongoose } from './postsLikes.schema';
import { CommentLikesRepository } from '../infrastructure/commentLikes.repo';
import { PostLikeMoongoose } from 'src/features/postLikes/domain/postsLikes.schema';
import { likeStatusEnum } from '../domain/commentLikesTypes';

@Injectable()
export class CommentLikesServices {
  constructor(private commentLikesRepository: CommentLikesRepository) {}

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

  async countCommentLikes(
    commentId: string,
    userId: null | string,
  ): Promise<any> {
    const likesCount = await this.commentLikesRepository.countCommentLikes(
      commentId,
      likeStatusEnum.Like,
    );
    // console.log('============likesCount=========');
    // console.log(likesCount);

    const dislikesCount = await this.commentLikesRepository.countCommentLikes(
      commentId,
      likeStatusEnum.Dislike,
    );
    let myStatus = likeStatusEnum.None;

    //     console.log('============userId=========');
    // console.log(userId);

    if (userId) {
      const requesterUserLike = await this.commentLikesRepository.findLike(
        commentId,
        userId,
      );
      // console.log("-------------------")
      // console.log("userId")
      // console.log(userId)
      console.log('requesterUserLike');
      console.log(requesterUserLike);
      myStatus = requesterUserLike?.myStatus
        ? requesterUserLike.myStatus
        : likeStatusEnum.None;
    }

    const result = {
      likesCount: likesCount,
      dislikesCount: dislikesCount,
      myStatus: myStatus,
    };
    return result;
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
