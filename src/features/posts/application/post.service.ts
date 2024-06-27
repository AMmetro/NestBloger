import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
// import { Post } from '../domain/post.entity';
import { PostRepository } from '../infrastructure/post.repository';
import { PostLikesServices } from 'src/features/postLikes/application/postLikes.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { likeStatusEnum } from 'src/features/postLikes/domain/postLikesTypes';
import { OutputBasicSortQueryType } from 'src/base/utils/sortQeryUtils';
import { PostCommentsRepository } from 'src/features/postComments/infrastructure/postComments.repo';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';
import { CommentLikesServices } from 'src/features/commentLikes/application/commentLikes.service';
import { BlogRepository } from 'src/features/blogs/infrastructure/blogs.repository';
import { createPostDTO } from 'src/features/blogs/domain/blog.entity';
import { randomUUID } from 'crypto';
import { RequestInputPostType } from '../api/dto/input/create-user.input.model';


// export class UsersService {
//   constructor(private usersRepository: UsersRepository) {}

// @Injectable()
@Injectable()
export class PostsService {
  constructor(
    // @InjectModel(Post.name) private postModel: Model<Post>,
    // @InjectModel
    private postRepository: PostRepository,
    private blogRepository: BlogRepository,
    private usersRepository: UsersRepository,
    private postLikesRepository: PostLikesRepository,
    private postLikesServices: PostLikesServices,
    private postCommentsRepository: PostCommentsRepository,
    private commentLikesRepository: CommentLikesRepository,
    private commentLikesServices: CommentLikesServices,
  ) {}

  async createPost(blogId: string, reqData: createPostDTO) {
    const currentBlog = await this.blogRepository.findById(blogId);
    if (!currentBlog) {
      return null;
    }
    const newPost = {
      id: randomUUID(),
      title: reqData.title,
      shortDescription: reqData.shortDescription,
      content: reqData.content,
      blogName: currentBlog.name,
      blogId: currentBlog.id,
      createdAt: new Date(),
    };
    const extendedLikesInfo = {
      dislikesCount: 0,
      likesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    const createdPost = await this.postRepository.create(newPost);

    return { ...createdPost, extendedLikesInfo: extendedLikesInfo };
  }

  async addUserDataToLike(newestLikes): Promise<any> {
    const enrichedLike = await Promise.all(
      newestLikes.map(async (like) => {
        const user = await this.usersRepository.getById(like.userId);
        if (user && user.login) {
          return {
            userId: like.userId,
            addedAt: like.addedAt,
            login: user.login,
          };
        } else {
          return null;
        }
      }),
    );
    return enrichedLike;
  }

  async composePostById(postId: string, userOptionalId: null): Promise<any> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      return null;
    }
    const postLikesInfo = await this.postLikesServices.countPostLikes(
      postId,
      userOptionalId,
    );

    const newestLikes = await this.postLikesRepository.findNewestLikes(
      postId,
      likeStatusEnum.Like,
    );
    const newestLikesWithUser = await this.addUserDataToLike(newestLikes);
    const extendedLikesInfo = {
      likesCount: postLikesInfo.likesCount,
      dislikesCount: postLikesInfo.dislikesCount,
      myStatus: postLikesInfo.myStatus,
      newestLikes: newestLikesWithUser,
    };
    return { ...post, extendedLikesInfo: extendedLikesInfo };
  }

  async composePostComments(
    postId: string,
    basicSortData: OutputBasicSortQueryType,
    userId: string | null,
  ): Promise<any> {
    const sortData = { id: postId, ...basicSortData };

    const currentPost = await this.postRepository.findById(postId);

    if (!currentPost) {
      return null;
    }
    // !
    const postComments =
      await this.postCommentsRepository.getPostComments(sortData);
    if (!postComments) {
      return null;
    }

    console.log("aaaaaaaaaaaa");
    console.log(postComments);

    const сommentsWithLikes = await Promise.all(
      postComments.items.map(async (comment) => {
        const countLikes = await this.commentLikesServices.countCommentLikes(
          comment.id,
          userId,
        );

        let currentLikeStatus = likeStatusEnum.None;
        if (userId) {
          const currentLike = await this.commentLikesRepository.findUserComment(
            userId,
            comment.id,
          );

          currentLikeStatus = currentLike
            ? currentLike.myStatus
            : likeStatusEnum.None;

            console.log("333333333333333333333333333333");
            console.log(currentLikeStatus);

        }

        const res = {
          id: comment.id,
          content: comment.content,
          createdAt: comment.createdAt,
          commentatorInfo: {userId: comment.commentatorInfo.userId, userLogin: comment.commentatorInfo.userLogin },
          likesInfo: {
            likesCount: countLikes.likesCount, 
            dislikesCount: countLikes.dislikesCount,
            myStatus: currentLikeStatus,
          },
        };
        return res;

        // return {
        //   ...comment,
        //   comentatorInfo: {userLogin: comment.user.login, userId: comment.user.login },
        //   likesInfo: {
        //     likesCount: countLikes.likesCount, 
        //     dislikesCount: countLikes.dislikesCount,
        //     myStatus: currentLikeStatus,
        //   },
        // };
      }),
    );

    console.log("bbbbbbbbbbbbbbbbbbb");
    console.log(сommentsWithLikes);

    const postCommentsWithLikes = { ...postComments, items: сommentsWithLikes };

    return postCommentsWithLikes;
  }

  async addLikesToPosts(postsNoLikes: any[], userId: string): Promise<any> {

    const postsWithLikes = await Promise.all(

      postsNoLikes.map(async (post) => {

    // 1 -  получаем три последних лайка 
        const newestLikes = await this.postLikesRepository.findNewestLikes(
          post.id,
          likeStatusEnum.Like,
        );

   // 2 -  добовляем в три последних лайка юзер логин + addedAt + userId

        const newestLikesWithUser = await this.addUserDataToLike(newestLikes);
         
        // 3 -  считаем лайки / дизлайки ...
        const countLikes = await this.postLikesServices.countPostLikes(
          post.id,
          userId,
        );
        const extendedLikesInfo = {
          likesCount: countLikes.likesCount,
          dislikesCount: countLikes.dislikesCount,
          myStatus: countLikes.myStatus,
          newestLikes: newestLikesWithUser,
          // newestLikes: newestLikes,
        };
        return { ...post, extendedLikesInfo: extendedLikesInfo };
      }),
    );

      // -----------------------------------------------------------------------------------------
/**
 SELECT (SELECT  count(CASE WHEN "myStatus" = 'Like' THEN 1 ELSE NULL END) FROM public.post_like) AS LikeCount,
 (SELECT  count(CASE WHEN "myStatus" = 'Dislike' THEN 1 ELSE NULL END) FROM public.post_like) AS DislikeCount,
 COALESCE((SELECT "myStatus" FROM public.post_like l where l."postId" = '02db52d1-7174-4c8c-afe1-d06b2cbb45ef' and l."userId" = null ), 'None') AS MyStatus,
 pl.id, "userId", "myStatus", "addedAt", "postId", "postLikeId", pu.login FROM public.post_like as pl 
 left join public.users as pu on pl."postLikeId" = pu."id" 
 WHERE "postId" = '02db52d1-7174-4c8c-afe1-d06b2cbb45ef' AND "myStatus" = 'Like';
 **/

  // SELECT count(CASE WHEN pl."myStatus" = 'Like' THEN 1 ELSE NULL END) as LikeAmount,
  //        count(CASE WHEN pl."myStatus" = 'Dislike' THEN 1 ELSE NULL END) as DislikeAmount,
  // FROM public."Posts" as p left join public."post_like" as pl ON p.id=pl."postId"  
  // where "blogId" = '6c47bf02-da03-4a3d-93ac-706a02b7b7ee' group by "title";
  // ---------------------------------------------------------------

    return postsWithLikes;
  }

  async addLike(
    postId: string,
    sendedLikeStatus: string,
    userId: string,
  ): Promise<any> {
    const postForLike = await this.postRepository.findById(postId);
    if (!postForLike) {
      return null;
    }

    const createdLike = await this.postLikesServices.addLikeToPost(
      postId,
      userId,
      sendedLikeStatus,
    );
    return createdLike;
  }



  async composeAllPosts(
    postsRequestsSortData: any,
    userId: null | string,
  ): Promise<any | null> {
    // const allPostsObject = await this.postRepository.getBlogPosts(
    const allPostsObject = await this.postRepository.findAllWithPagination(
      postsRequestsSortData,
    );

    if (!allPostsObject) {
      return null;
    }
    const postsWithLikes = await this.addLikesToPosts(
      allPostsObject.items,
      userId,
    );

    return { ...allPostsObject, items: postsWithLikes };
  }

  async findAll(): Promise<any> {
    const allPosts = this.postRepository.findAll();
    return allPosts;
  }
  async update(
    updatedPostId: string,
    updatePostModel: RequestInputPostType,
  ): Promise<boolean> {
    const postForUpd = await this.postRepository.findById(updatedPostId);
    if (!postForUpd) {
      return null;
    }
    const postIsUpdated = await this.postRepository.update(
      updatedPostId,
      updatePostModel,
    );
    return postIsUpdated;
  }

  // async deleteAll(): Promise<any> {
  //   const isDeleted = await this.blogModel.deleteMany();
  //   return isDeleted.deletedCount;
  // }
}
