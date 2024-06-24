import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
// import { PostLikeMoongoose } from '../domain/postsLikes.schema';
// import { PostLike } from '../domain/postLikesTypes';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { EntityManager, Not, Repository } from 'typeorm';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PostLike } from '../domain/postsLikes.schema';
import { newLikeType } from 'src/features/postComments/domain/postCommentTypes';

@Injectable()
export class PostLikesRepository {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
    // @InjectModel(PostLikeMoongoose.name)
    // private postLikesModel: Model<PostLikeMoongoose>,
    // private usersRepository: UsersRepository,

    // **--------------------------------------
    // @InjectRepository(PostLike)
    // private readonly postLike: Repository<PostLike>,
    // **--------------------------------------
  ) {}

  async findAllByPostId(postId: string): Promise<any | null> {
    try {
      // const postLikes = await this.postLikesModel.find({ postId: postId });
      // if (!postLikes) {
      //   return null;
      // }
      // return postLikes.map((like) => PostLike.mapper(like));

      const postLikes = await this.entityManager.find(PostLike, {
        where: {
        postId: postId,
        },
        });
        return postLikes

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findLike(
    postId: string,
    userId: string,
  ): Promise<any | null> {
    try {
      // const postLikes = await this.postLikesModel.findOne({
      //   postId: postId,
      //   userId: userId,
      // });
      // if (!postLikes) {
      //   return null;
      // }
      // return postLikes;
      const postLikes = await this.entityManager.find(PostLike, {
        where: {
        postId: postId,
        userId: userId,
        // !!!!!!!!!!!!!!!!!!!!!!!!!
        user: true,
        },
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


  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  async findNewestLikes(postId: string, myStatus: string): Promise<any | null> { 
    try {
      //** 
      //* SELECT pl.id, "userId", "myStatus", "addedAt", "postId", "postLikeId", pu.login
      //* FROM public.post_like as pl left join public.users as pu on lp."postLikeId" = pu."id" 
      //* WHERE "postId" = '02db52d1-7174-4c8c-afe1-d06b2cbb45ef' AND "myStatus" = 'Like'
      //**

      const newestLikes = await this.entityManager.find(PostLike, {
        where: {
        postId: postId,
        myStatus: myStatus
        },
        relations: {
        /**
        * наименование столбца который указан связью
        **/
        user: true, 
       },
        order: {
        addedAt: 'DESC'
        },
        take: 3,
        loadEagerRelations: false
        });
        return newestLikes

      

      // const newestLikes = await this.postLikesModel
      //   .find({
      //     postId: postId,
      //     myStatus: myStatus,
      //   })
      //   // 1 asc старая запись в начале
      //   // -1 descend новая в начале
      //   .sort({ addedAt: -1 })
      //   .limit(3)
      //   .lean();
      // if (!newestLikes) {
      //   return null;
      // }
      // return newestLikes.map((like) => {
      //   return PostLike.mapper(like);
      // });

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async countPostLikes(postId: string, myStatus: string): Promise<any | null> {
    try {

      // const test  = await this.entityManager.find(PostLike, {})

      const likesCount = await this.entityManager.count(PostLike, {
        where: {
        postId: postId,
        myStatus: myStatus
        },
        });

        // console.log("--------------------");
        // console.log("                     ");
        // console.log("                     ");
        // console.log("                     ");
        // console.log("count");
        // console.log(likesCount);

        return likesCount
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createLike(newLike: newLikeType): Promise<any | null> {
    const newLikeItem = new PostLike();
    newLikeItem.postId = newLike.postId;
    newLikeItem.userId = newLike.userId;
    newLikeItem.myStatus = newLike.myStatus;
    newLikeItem.addedAt = newLike.addedAt;

    try {
      const newLike = await this.entityManager.getRepository(PostLike).save(newLikeItem);
        return newLike
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateLike(newLike: newLikeType, id:string): Promise<any | null> {
    const newLikeItem = new PostLike();
    newLikeItem.postId = newLike.postId;
    newLikeItem.userId = newLike.userId;
    newLikeItem.myStatus = newLike.myStatus;
    newLikeItem.addedAt = newLike.addedAt;

    const all = await this.entityManager.getRepository(PostLike).find();

    console.log("all");
    console.log(all);
    console.log("--------id----------");
    console.log(id);
    console.log("------newLike.myStatus-------");
    console.log(newLike.myStatus);


    try {
  const updLike = await this.entityManager.getRepository(PostLike).update(id, {myStatus: newLike.myStatus});
  console.log("========updLike=========");
  console.log(updLike);
      return updLike
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any | null> {
    try {
      const isDelete = await this.entityManager.delete(PostLike, {})
      const countOfDeletedItems = isDelete.affected
    } catch (e) {
      console.log(e);
      return null;
    }
  }

}
