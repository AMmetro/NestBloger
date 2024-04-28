import { WithId } from 'mongodb';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { User } from './users.schema';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { UsersService } from 'src/features/users/application/users.service';
import { DevicesServices } from 'src/features/devices/application/devices.service';
import { PostCommentsRepository } from '../infrastructure/postComments.repo';
import { PostRepository } from 'src/features/posts/infrastructure/post.repository';
import { PostLikesServices } from 'src/features/postLikes/application/postLikes.service';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';
import { CommentLikesServices } from 'src/features/commentLikes/application/commentLikes.service';
// import { User } from '../users/api/dto/output/user.output.model';
// import { UsersRepository } from '../users/infrastructure/users.repository';
// import { RequestInputUserType } from '../users/api/dto/input/create-user.input.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class PostCommentsService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
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
    // console.log('============postComments=========');
    // console.log(postComments);
    // работает
    // const composedCommentLikes = await this.postLikesServices.countPostLikes(
    //   commentId,
    //   userOptionalId,
    // );

    // НЕработает
    const composedCommentLikes =
      await this.commentLikesServices.countCommentLikes(
        commentId,
        userOptionalId,
      );
    // console.log('============composedCommentLikes=========');
    // console.log(composedCommentLikes);

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
      commentatorInfo: {
        userId: commentatorInfo.id,
        userLogin: commentatorInfo.login,
      },
    };
    const createdComment =
      await this.postCommentsRepository.create(newCommentModel);
    if (!createdComment) {
      return null;
    }

    //   console.log('============createdComment=========');
    // console.log(createdComment);

    return {
      ...createdComment,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
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

    const existingCommentSLike = await this.commentLikesRepository.findLike(
      commentId,
      userId,
    );

    const createdLikeModel = {
      commentId: commentId,
      userId: userId,
      myStatus: sendedLikeStatus,
      addedAt: new Date(),
    };

                                            console.log('============existingCommentSLike=========');
                                            console.log(existingCommentSLike); 

    if (!existingCommentSLike) {
      const createdLikeForComment =
        await this.commentLikesRepository.createLike(createdLikeModel);
      return createdLikeForComment;
      // console.log(createdLikeForComment);
    }

                                        console.log('============createdLikeModel=========');
                                        console.log(createdLikeModel);

    if (existingCommentSLike.myStatus === sendedLikeStatus) {
      return existingCommentSLike;
    }
    existingCommentSLike.myStatus = sendedLikeStatus;
    await existingCommentSLike.save();

    console.log('============existingLikeForComment RETURN=========');
    console.log(existingCommentSLike);

    return existingCommentSLike;
  }
}
