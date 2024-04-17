import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PostLikeMoongoose } from 'src/postLikes/postsLikes.schema';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLikeMoongoose.name)
    private postLikesModel: Model<PostLikeMoongoose>,
  ) {}

  async findAllByPostId(postId: string): Promise<PostLikeMoongoose | null> {
    try {
      const postLikes = await this.postLikesModel.findById(postId);
      if (!postLikes) {
        return null;
      }
      // return PostClass.mapper(post);
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
      // return PostClass.mapper(post);
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
      return newestLikes;
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

      // if (!newestLikes) {
      //   return null;
      // }
      return likesCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
