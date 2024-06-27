import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { CommentLike as CommentLikeType } from '../domain/commentLikesTypes';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager } from 'typeorm';
import { CommentLike  } from '../domain/commentLikes.schema';
// import { CommentLikeMoongoose } from '../domain/commentLikes.schema';

@Injectable()
export class CommentLikesRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    // @InjectModel(CommentLikeMoongoose.name)
    // private commentLikeModel: Model<CommentLike>,
  ) {}

  async findComment(id: string): Promise<any | null> {
    try {
      const comment = await this.entityManager.find(CommentLike, {
        where: {
        id: id,
        },
        });
      return comment
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findUserComment(userId: string, commentId): Promise<any | null> {
    try {
      const comment = await this.entityManager.find(CommentLike, {
        where: {
        postCommentsId: commentId,
        userId: userId,
        },
        });
        return comment[0]

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findAllComment(): Promise<any | null> {
    try {
      const comment = await this.entityManager.find(CommentLike, {});
      return comment

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createLike(newLike: CommentLikeType): Promise<any | null> {
    try {
      const newCommentLike = new CommentLike();
      newCommentLike.postCommentsId = newLike.commentId;
      newCommentLike.userId = newLike.userId; 
      newCommentLike.myStatus = newLike.myStatus;
      newCommentLike.addedAt = newLike.addedAt;

      const like = await this.entityManager.getRepository(CommentLike).create(newCommentLike)
      const result = await this.entityManager.save(like);
      return result

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updLike(updLike: {id: string, myStatus: string }): Promise<any | null> {
    try {
      /**
       * updated like by likeId
       */
      const updResult = await this.entityManager.getRepository(CommentLike).update(updLike.id, {myStatus: updLike.myStatus});
      console.log("updResult"); 
      console.log(updResult); 
      return updResult.affected
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async countCommentLikes(
    postCommentId: string,
    myStatus: string,
  ): Promise<any | null> {
    try {
      const likesCount = await this.entityManager.getRepository(CommentLike).count({
        where: {
        postCommentsId: postCommentId,
        myStatus: myStatus
        }
        });
        return likesCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findLike(commentId: string, userId: string): Promise<any | null> {
    try {
      const like = await this.entityManager.find(CommentLike, {
        where: {
        userId: userId,
        postCommentsId: commentId,
        },
        });
      return like[0]
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any | null> {
    try {
      // await this.entityManager.getRepository(CommentLike).delete({});
      const likesCount = await this.entityManager.getRepository(CommentLike).delete({});
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
