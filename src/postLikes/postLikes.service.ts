import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PostLikesRepository } from './postLikes.repo';
import { PostLikeMoongoose } from './postsLikes.schema';
import { likeStatusEnum } from 'src/features/postLikes/domain/postLikesTypes';

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
}
