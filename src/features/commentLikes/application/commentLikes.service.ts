import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommentLikesRepository } from '../infrastructure/commentLikes.repo';
// import { PostLikeMoongoose } from 'src/features/postLikes/domain/postsLikes.schema';
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

    const dislikesCount = await this.commentLikesRepository.countCommentLikes(
      commentId,
      likeStatusEnum.Dislike,
    );
    let myStatus = likeStatusEnum.None;
    if (userId) {
      const requesterUserLike = await this.commentLikesRepository.findLike(
        commentId,
        userId,
      );
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
}
