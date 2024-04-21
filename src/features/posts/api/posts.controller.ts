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

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postRepository: PostRepository,
  ) {}

  // @Post(':id/posts')
  // @HttpCode(201)
  // async createPost(
  //   @Param('id') userId: number,
  //   @Body() reqBody: any,
  // ): Promise<any> {

  //   const createPostModel = {
  //     title: reqBody.title,
  //     shortDescription: reqBody.shortDescription,
  //     content: reqBody.content,
  //   };
  //   return "createdPost";
  // }

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() reqBody: any,
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

  // @Delete()
  // async deleteAll(): Promise<any> {
  //   const countDelDoc = await this.blogsService.deleteAll();
  //   return countDelDoc;
  // }

  // @Put(':id')
  // updateBlog(@Param('id') userId: number, @Body() model: {}): any {
  //   return
  // }

  @Get()
  async getAll(
    @Query() reqQuery: any,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
  ) {
    const userOptionalId = null;
    // !!!!!!!!!!!!!!!!!!!!!!!!
    const postsRequestsSortData = basicSortQuery(reqQuery);
    const result = await this.postsService.composeAllPosts(
      postsRequestsSortData,
      userOptionalId,
    );
    if (!result) {
      res.sendStatus(404);
    }
    return result;
  }

  @Get(':id')
  // @UseGuards(JwtAuthGuard)
  async getOne(
    @Param('id') postId: string,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
    // @Req() req: any,
  ) {
    if (!postId) {
      throw new BadRequestException([
        { message: 'not found user id', field: 'userId' },
      ]);
    }
    // const userOptionalId = req?.user?.userId || null;
    const userOptionalId = null;
    // console.log("--------!!!!!!!!!-------req")
    // console.log(userId)
    const post = await this.postsService.composePostById(
      postId,
      userOptionalId,
    );

                                                              console.log("post result")
                                                              console.log(post)

    if (!post) {
      throw new BadRequestException([
        { message: 'not found user', field: 'user' },
      ]);
      // res.sendStatus(404);
    }
    res.status(200).send(post);
  }

  @Put(':id')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async updatePost(
    @Param('id') postId: string,
    @Body() reqBody: any,
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
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
  }

  @Put(':postId/like-status')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async likePost(
    @Param('postId') postId: string,
    @Body() likeModel: IncomLikeStatusDTO,
    // @Res({ passthrough: true }) res: Response,
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

    console.log("result")
    console.log(result)

    if (!result) {
      return res.sendStatus(404);
      // throw new BadRequestException([
      //   { message: 'wrong like status', field: 'likeStatus' },
      // ]);
    }
    return res.sendStatus(204);
  //  return res.status(201).send(result);
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(
    @Param('id') postId: string,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
  ): Promise<any> {
    if (!ObjectId.isValid(postId)) {
      res.sendStatus(404);
      return;
    }
    const isPostExist = await this.postRepository.findById(postId);
    if (!isPostExist) {
      res.sendStatus(404);
    }
    const isDeleted = await this.postRepository.deleteById(postId);
    if (!isDeleted) {
      res.sendStatus(404);
    }
    return isDeleted;
  }
}
