import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { likeStatusEnum } from 'src/features/postLikes/domain/postLikesTypes';
import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
// import { PostLikeMoongoose } from '../domain/postsLikes.schema';

@Injectable()
export class PostLikesServices {
  constructor(
    // @InjectModel(PostLikeMoongoose.name)
    // private postLikesModel: Model<PostLikeMoongoose>,
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

      myStatus = requesterUserLike[0]?.myStatus
        ? requesterUserLike[0].myStatus
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

    const existingLikeForPost = await this.postLikesRepository.findLike(
      postId,
      userId,
    );

    console.log("postId");
    console.log(postId);
    console.log("userId");
    console.log(userId);
    console.log("existingLikeForPost");
    console.log(existingLikeForPost);

    // было обращение к модели в самом сервисе
    // const existingLikeForPost = await this.postLikesModel.findOne({
    //   postId: postId,
    //   userId: userId,
    // }); 
    const newLike = {
      postId: postId,
      userId: userId,
      myStatus: sendedLikeStatus,
      addedAt: new Date(),
    };

     if (existingLikeForPost.length < 1) {
      const createdLike = await this.postLikesRepository.createLike(newLike);
      return createdLike;
    }
    if (existingLikeForPost[0].myStatus === sendedLikeStatus) {
      return newLike;
    }

    const likeId = existingLikeForPost[0].id
    const updateLike = await this.postLikesRepository.updateLike(newLike, likeId);
    return !!updateLike.affected;
  }
}
