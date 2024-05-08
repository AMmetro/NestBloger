import {
  Controller,
  Get,
  Param,
  Res,
  Post,
  HttpCode,
  Body,
  Put,
  Delete,
  Query,
  BadRequestException,
  UseGuards,
  Req,
  Headers,
  NotFoundException,
} from '@nestjs/common';
// import { PostsService } from './posts.service';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
// import { PostRepository } from './posts.repo';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
// import { IncomLikeStatusDTO, likeStatusEnum } from 'src/features/postLikes/domain/postLikesTypes';
import { PostsService } from '../application/post.service';
import { PostRepository } from '../infrastructure/post.repository';
import {
  IncomLikeStatusDTO,
  likeStatusEnum,
} from 'src/features/postLikes/domain/postLikesTypes';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { JwtStrategy } from 'src/features/auth/strategies/jwtStrategy';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { AuthService } from 'src/features/auth/application/auth.service';
import { OptioanlAuthGuard } from 'src/common/guards/optionalAuth.guard';
import { CreatePostModel } from './dto/input/create-user.input.model';

import { PostCommentsRepository } from 'src/features/postComments/infrastructure/postComments.repo';
import { CreateCommentDto } from 'src/features/postComments/domain/postCommentTypes';
import { PostCommentsService } from 'src/features/postComments/application/postComments.service';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postRepository: PostRepository,
    private readonly authService: AuthService,
    private readonly postCommentsRepository: PostCommentsRepository,
    private readonly postCommentsService: PostCommentsService,
  ) {}

  @Get()
  @UseGuards(OptioanlAuthGuard)
  async getAll(
    @Query() reqQuery: any,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
  ) {
    const optionalUserId = req.user?.userId || null;
    const postsRequestsSortData = basicSortQuery(reqQuery);
    const result = await this.postsService.composeAllPosts(
      postsRequestsSortData,
      optionalUserId,
    );
    if (!result) {
      res.sendStatus(404);
    }
    return result;
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  @UseGuards(OptioanlAuthGuard)
  async getOne(
    // Установка guard на данный роут
    @Headers() headers,
    @Param('id') postId: string,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
    @Req() req: any,
  ) {
    // ----------------------------------------------------------------------------
    const optionalUserId = req.user?.userId || null;

    if (!postId) {
      throw new BadRequestException([
        { message: 'not found user id', field: 'userId' },
      ]);
    }
    const post = await this.postsService.composePostById(
      postId,
      optionalUserId,
    );

    // console.log("post result")
    // console.log(post)

    if (!post) {
      // почему это не возвращает 404 а возвращает 400 ????
      // throw new NotFoundException([
      //   { message: 'not found user', field: 'user' },
      // ]);
      res.sendStatus(404);
    }
    res.status(200).send(post);
  }

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() reqBody: CreatePostModel,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { title, shortDescription, content, blogId } = reqBody;
    const newPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
    };
    const newPost = await this.postsService.createPost(blogId, newPostModal);
    if (!newPost) {
      res.sendStatus(404);
      return;
    }
    return newPost;
  }

  @Get(':id/comments')
  @UseGuards(OptioanlAuthGuard)
  @HttpCode(200)
  async getAllComments(
    @Req() req: any,
    @Res() res: Response,
    @Query() reqQuery: any,
    @Param('id') postId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userOptionalId = req.user?.userId || null;
    if (!postId) {
      return res.sendStatus(401);
    }
    const basicSortData = basicSortQuery(reqQuery);
    const result = await this.postsService.composePostComments(
      postId,
      basicSortData,
      userOptionalId,
    );
    if (!result) {
      throw new NotFoundException([
        { message: 'not found post', field: 'post' },
      ]);
    }
    return res.status(200).send(result);
  }

  @Post(':id/comments')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createComment(
    @Body() reqBody: CreateCommentDto,
    @Req() req: any,
    @Res() res: Response,
    @Param('id') postId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const { content } = reqBody;
    const userId = req.user?.userId;
    if (!postId) {
      return res.sendStatus(401);
    }
    if (!userId) {
      return res.sendStatus(401);
    }
    const result = await this.postCommentsService.createComment(
      postId,
      userId,
      content,
    );
    if (!result) {
      throw new NotFoundException([
        { message: 'not found comment', field: 'comment' },
      ]);
    }
    return res.status(201).send(result);
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(
    @Param('id') postId: string,
    @Body() reqBody: CreatePostModel,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
  ): Promise<any> {
    if (!ObjectId.isValid(postId)) {
      res.sendStatus(404);
      return;
    }
    const postForUpdated = await this.postRepository.findById(postId);
    if (postForUpdated === null) {
      res.sendStatus(404);
      return;
    }
    const { title, shortDescription, content, blogId } = reqBody;
    const updatedPostModal = {
      title: title,
      shortDescription: shortDescription,
      content: content,
      blogId: blogId,
    };
    const postIsUpdated = await this.postsService.update(
      postId,
      updatedPostModal,
    );
    if (!postIsUpdated) {
      return res.sendStatus(404);
    }
    res.sendStatus(204);
  }

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async likePost(
    @Param('postId') postId: string,
    @Body() likeModel: IncomLikeStatusDTO,
    @Res() res: Response,
    @Req() req: any,
  ): Promise<any> {
    if (!ObjectId.isValid(postId)) {
      return res.sendStatus(404);
    }
    const userId = req.user.userId;
    if (!userId) {
      return res.sendStatus(401);
    }
    const likeStatus = likeModel.likeStatus;
    if (!likeStatus || !likeStatusEnum.hasOwnProperty(likeStatus)) {
      throw new BadRequestException([
        { message: 'wrong like status', field: 'likeStatus' },
      ]);
    }
    const result = await this.postsService.addLike(postId, likeStatus, userId);

    if (!result) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
  }

  @Delete(':id')
  async deleteById(
    @Param('id') postId: string,
    @Res() res: Response,
  ): Promise<any> {
    if (!ObjectId.isValid(postId)) {
      return res.sendStatus(404);
    }
    const isPostExist = await this.postRepository.findById(postId);
    if (!isPostExist) {
      res.sendStatus(404);
    }
    const isDeleted = await this.postRepository.deleteById(postId);
    if (!isDeleted) {
      res.sendStatus(404);
    }
    res.sendStatus(204);
  }
}
