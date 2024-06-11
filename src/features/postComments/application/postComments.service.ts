import { ForbiddenException, Injectable } from '@nestjs/common';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { PostCommentsRepository } from '../infrastructure/postComments.repo';
import { PostRepository } from 'src/features/posts/infrastructure/post.repository';
import { PostLikesServices } from 'src/features/postLikes/application/postLikes.service';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';
import { CommentLikesServices } from 'src/features/commentLikes/application/commentLikes.service';
@Injectable()
export class PostCommentsService {
  constructor(
    private postCommentsRepository: PostCommentsRepository,
    private commentLikesServices: CommentLikesServices,
    private postLikesServices: PostLikesServices,
    private usersRepository: UsersRepository,
    private readonly postRepository: PostRepository,
    private readonly commentLikesRepository: CommentLikesRepository,
  ) {}

  async composePostComment(
    commentId: string,
    userOptionalId: null | string,
  ): Promise<any> {
    const postComments =
      await this.postCommentsRepository.findComment(commentId);

    if (!postComments) {
      return null;
    }
    const composedCommentLikes =
      await this.commentLikesServices.countCommentLikes(
        commentId,
        userOptionalId,
      );
    const resultComment = {
      id: commentId,
      content: postComments.content,
      commentatorInfo: {
        userId: postComments.commentatorInfo.userId,
        userLogin: postComments.commentatorInfo.userLogin,
      },
      likesInfo: composedCommentLikes,
      createdAt: postComments.createdAt,
    };
    return resultComment;
  }

  async createComment(
    commentedPostId: string,
    userCommentatorId: string,
    content: string,
  ): Promise<any> {
    const commentedPost = await this.postRepository.findById(commentedPostId);
    if (!commentedPost) {
      return null;
    }
    const commentatorInfo =
      await this.usersRepository.getById(userCommentatorId);
    if (!commentatorInfo) {
      return null;
    }
    const newCommentModel = {
      content: content,
      postId: commentedPostId,
      createdAt: new Date().toISOString(),
      userId: commentatorInfo.id,
    };
    // const newCommentModel = {
    //   content: content,
    //   postId: commentedPostId,
    //   createdAt: new Date().toISOString(),
    //   commentatorInfo: {
    //     userId: commentatorInfo.id,
    //     userLogin: commentatorInfo.login,
    //   },
    // };
    const createdComment =
      await this.postCommentsRepository.create(newCommentModel);
    if (!createdComment) {
      return null;
    }
    return {
      ...createdComment,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }

  async updateComment(
    commentId: string,
    userCommentatorId: string,
    content: string,
  ): Promise<any> {
    const postCommentForUpdate =
      await this.postCommentsRepository.findComment(commentId);
    if (!postCommentForUpdate) {
      return null;
    }
    if (postCommentForUpdate.commentatorInfo.userId !== userCommentatorId) {
      throw new ForbiddenException([
        { message: 'not found comment', field: 'comment' },
      ]);
    }
    const updCommentModel = {
      ...postCommentForUpdate,
      content: content,
    };

    const isUpdated = await this.postCommentsRepository.update(updCommentModel);
    if (!isUpdated) {
      return null;
    }
    return isUpdated;
  }

  async addLikeToComment(
    commentId: string,
    sendedLikeStatus: string,
    userId: string,
  ): Promise<any> {
    const existingPostComment =
      await this.postCommentsRepository.findComment(commentId);
    if (!existingPostComment) {
      return null;
    }
    const existingCommentLike = await this.commentLikesRepository.findLike(
      commentId,
      userId,
    );
    const newLikeModel = {
      commentId: commentId,
      userId: userId,
      myStatus: sendedLikeStatus,
      addedAt: new Date(),
    };

    if (!existingCommentLike) {
      const createdLikeForComment =
        await this.commentLikesRepository.createLike(newLikeModel);
      return createdLikeForComment;
    }
    if (existingCommentLike.myStatus === sendedLikeStatus) {
      return existingCommentLike;
    }
    existingCommentLike.myStatus = sendedLikeStatus;
    await this.commentLikesRepository.updLike(existingCommentLike);
    return existingCommentLike;
  }

  async deleteComment(commentId: string, userId: string): Promise<any> {
    const comment = await this.postCommentsRepository.findComment(commentId);
    if (!comment) {
      return 404;
    }
    if (comment.commentatorInfo.userId !== userId) {
      return 403;
    }
    const deletedComment =
      await this.postCommentsRepository.deleteOne(commentId);
    return deletedComment;
  }
}
