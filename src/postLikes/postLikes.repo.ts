import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { PostLike } from './postsLikes.schema';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectModel(PostLike.name) private postLikesModel: Model<PostLike>,
  ) {}

  async findAllByPostId(postId: string): Promise<PostLike | null> {
    try {
      const postLikes = await this.postLikesModel.findById(postId);
      // console.log("post")
      // console.log(post)
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

      console.log('newestLikes');
      console.log(newestLikes);
      if (!newestLikes) {
        return null;
      }
      return newestLikes;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
