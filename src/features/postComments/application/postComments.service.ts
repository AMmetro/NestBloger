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
// import { User } from '../users/api/dto/output/user.output.model';
// import { UsersRepository } from '../users/infrastructure/users.repository';
// import { RequestInputUserType } from '../users/api/dto/input/create-user.input.model';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class PostCommentsService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<User>,
    private postCommentsRepository: PostCommentsRepository,
    private usersService: UsersService,
    private devicesServices: DevicesServices,
    private usersRepository: UsersRepository,
    private readonly postRepository: PostRepository,
  ) {}

  async composePostComment(
    commentsId: string,
    userOptionalId: null | string,
  ): Promise<any> {
    const comment = await this.postCommentsRepository.findComment(commentsId);
    if (!comment) {
      return null;
    }
    // const composedCommentLikes = await LikeCommentsServices.composeCommentLikes(commentId, userId)
    const composedCommentLikes = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
    };

    const resultComment = {
      id: commentsId,
      content: comment.content,
      commentatorInfo: {
        userId: comment.commentatorInfo.userId,
        userLogin: comment.commentatorInfo.userLogin,
      },
      likesInfo: composedCommentLikes,
      createdAt: comment.createdAt,
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

        console.log('============createdComment=========');
      console.log(createdComment);

    return {
      ...createdComment,
      likesInfo: {
        likesCount: 0,
        dislikesCount: 0,
        myStatus: 'None',
      },
    };
  }
}
