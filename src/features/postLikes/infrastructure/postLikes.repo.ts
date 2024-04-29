import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PostLikeMoongoose } from '../domain/postsLikes.schema';
import { PostLike } from '../domain/postLikesTypes';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLikeMoongoose.name)
    private postLikesModel: Model<PostLikeMoongoose>,
    private usersRepository: UsersRepository,
  ) {}

  async findAllByPostId(postId: string): Promise<any | null> {
    try {
      const postLikes = await this.postLikesModel.find({ postId: postId });
      if (!postLikes) {
        return null;
      }
      return postLikes.map((like) => PostLike.mapper(like));
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findLike(
    postId: string,
    userId: string,
  ): Promise<PostLikeMoongoose | null> {
    try {
      const postLikes = await this.postLikesModel.findOne({
        postId: postId,
        userId: userId,
      });
      if (!postLikes) {
        return null;
      }
      return postLikes;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findNewestLikes(postId: string, myStatus: string): Promise<any | null> {
    try {
      const newestLikes = await this.postLikesModel
        .find({
          postId: postId,
          myStatus: myStatus,
        })
        // 1 asc старая запись в начале
        // -1 descend новая в начале
        .sort({ addedAt: -1 })
        .limit(3)
        .lean();

      if (!newestLikes) {
        return null;
      }

      return newestLikes.map((like) => {
        return PostLike.mapper(like);
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async countPostLikes(postId: string, myStatus: string): Promise<any | null> {
    try {
      const likesCount = await this.postLikesModel.countDocuments({
        postId: postId,
        myStatus: myStatus,
      });
      return likesCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
