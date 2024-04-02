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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { PostRepository } from './posts.repo';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';

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

  @Put(':id')
  @HttpCode(201)
  async updatePost(
    @Param('id') postId: string,
    @Body() reqBody: any,
    @Res({ passthrough: true }) res: Response,
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

  @Get(':id')
  async getOne(
    @Param('id') postId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userOptionalId = null;
    const post = await this.postsService.composePostById(postId, userOptionalId);
    if (!post) {
      res.sendStatus(404);
      //throw new NotFoundException()
      //return new Error("404");
    }
    return post;
  }

  @Get()
  async getAll(
    @Query() reqQuery: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const userOptionalId = null;
    // !!!!!!!!!!!!!!!!!!!!!!!!
    const postsRequestsSortData = basicSortQuery(reqQuery)
    const result = await this.postsService.composeAllPosts(
      postsRequestsSortData,
      userOptionalId,
    );
    if (!result) {
      res.sendStatus(404);
    }
    return result;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(
    @Param('id') postId: string,
    @Res({ passthrough: true }) res: Response,
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
