import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { PostLikeMoongoose } from './postsLikes.schema';
import { likeStatusEnum } from 'src/features/postLikes/domain/postLikesTypes';
import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import { PostLikeMoongoose } from '../domain/postsLikes.schema';

@Injectable()
export class PostLikesServices {
  constructor(
    @InjectModel(PostLikeMoongoose.name)
    private postLikesModel: Model<PostLikeMoongoose>,
    private postLikesRepository: PostLikesRepository,
  ) {}

  async countPostLikes(postId: string, userId: null | string): Promise<any> {
    const likesCount = await this.postLikesRepository.countPostLikes(
      postId,
      likeStatusEnum.Like,
    );
    const dislikesCount = await this.postLikesRepository.countPostLikes(
      postId,
      likeStatusEnum.Dislike,
    );
    let myStatus = likeStatusEnum.None;
    if (userId) {
      const requesterUserLike = await this.postLikesRepository.findLike(
        postId,
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

  async addLikeToPost(
    postId: string,
    userId: string,
    sendedLikeStatus: string,
  ): Promise<any> {
    const existingLikeForPost = await this.postLikesModel.findOne({
      postId: postId,
      userId: userId,
    });
    const newLike = {
      postId: postId,
      userId: userId,
      myStatus: sendedLikeStatus,
      addedAt: new Date(),
    };

    if (!existingLikeForPost) {
      const LikeInstance = new this.postLikesModel(newLike);
      LikeInstance.save();
      return newLike;
    }
    if (existingLikeForPost.myStatus === sendedLikeStatus) {
      return newLike;
    }
    existingLikeForPost.myStatus = sendedLikeStatus;
    await existingLikeForPost.save();

    // const xxx = await this.postLikesModel.find()

    // console.log("=======xxx=======")
    // console.log(xxx)

    // newLike.myStatus = sendedLikeStatus;
    return newLike;
  }
}
