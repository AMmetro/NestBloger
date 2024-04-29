import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
// import { Post } from './posts.types';
// import { Blog, MappedBlogType } from 'src/blogs/blog.types';
// import { PostRepository } from './posts.repo';
import { BlogRepository } from 'src/blogs/blog.repo';
import { createPostDTO } from 'src/blogs/blog.types';

import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import { Post } from '../domain/post.entity';
import { PostRepository } from '../infrastructure/post.repository';
import { PostLikesServices } from 'src/features/postLikes/application/postLikes.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { likeStatusEnum } from 'src/features/postLikes/domain/postLikesTypes';
import { OutputBasicSortQueryType } from 'src/base/utils/sortQeryUtils';
import { PostCommentsRepository } from 'src/features/postComments/infrastructure/postComments.repo';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';
import { CommentLikesServices } from 'src/features/commentLikes/application/commentLikes.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
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
    const postComments =
      await this.postCommentsRepository.getPostComments(sortData);
    if (!postComments) {
      return null;
    }
    const сommentsWithLikes = await Promise.all(
      postComments.items.map(async (comment) => {
        // const likesCount = await CommentLikesModel.countDocuments({
        //   commentId: comment.id,
        //   myStatus: likeStatusEnum.Like,
        // });
        // const dislikesCount = await CommentLikesModel.countDocuments({
        //   commentId: comment.id,
        //   myStatus: likeStatusEnum.Dislike,
        // });

        // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

        const countLikes = await this.commentLikesServices.countCommentLikes(
          comment.id,
          userId,
        );

        // const [likesCount, dislikesCount] = await Promise.all([
        //   this.commentLikesRepository.countDocuments({
        //     commentId: comment.id,
        //     myStatus: likeStatusEnum.Like,
        //   }),
        //   this.commentLikesRepository.countDocuments({
        //     commentId: comment.id,
        //     myStatus: likeStatusEnum.Dislike,
        //   }),
        // ]);




        let currentLikeStatus = likeStatusEnum.None;
        if (userId) {
          const currentLike = await this.commentLikesRepository.findUserComment(
            userId,
            comment.id,
          );

          // console.log("currentLike")
          // console.log(currentLike)
          // console.log("userId")
          // console.log(userId)
          // console.log("comment.id")
          // console.log(comment.id)

          currentLikeStatus = currentLike
            ? currentLike.myStatus
            : likeStatusEnum.None;
        }

        return {
          ...comment,
          likesInfo: {
            likesCount: countLikes.likesCount,
            dislikesCount: countLikes.dislikesCount,
            myStatus: currentLikeStatus,
          },
        };
      }),
    );
    const postCommentsWithLikes = { ...postComments, items: сommentsWithLikes };
    return postCommentsWithLikes;
  }

  async addLikesToPosts(postsNoLikes: any, userId: any): Promise<any> {
    const postsWithLikes = await Promise.all(
      postsNoLikes.map(async (post) => {
        const newestLikes = await this.postLikesRepository.findNewestLikes(
          post.id,
          likeStatusEnum.Like,
        );
        const newestLikesWithUser = await this.addUserDataToLike(newestLikes);
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
    const allPostsObject = await this.postRepository.getBlogPosts(
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

  async update(updatedPostId: string, updatePostModel: any): Promise<boolean> {
    const postForUpd = this.postRepository.findById(updatedPostId);
    if (!postForUpd) {
      return null;
    }
    const postIsUpdated = this.postRepository.update(
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
