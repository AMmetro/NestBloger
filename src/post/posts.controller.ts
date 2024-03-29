import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Delete,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { Response } from 'express';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


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

  // @Post()
  // @HttpCode(201)
  // async createBlog(@Body() dto: BlogDto): Promise<Blog> {
  //   const createdBlog = await this.blogsService.create(dto);
  //   const mappedCreatedBlog = Blog.mapper(createdBlog);
  //   return mappedCreatedBlog;
  // }

  // @Delete()
  // async deleteAll(): Promise<any> {
  //   const countDelDoc = await this.blogsService.deleteAll();
  //   return countDelDoc;
  // }

  // @Put(':id')
  // updateBlog(@Param('id') userId: number, @Body() model: {}): any {
  //   return
  // } 

  @Get(':id')
  async findOne(
    @Param('id') postId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const post = await this.postsService.composePostById(postId);
    if (!post) {
      res.sendStatus(404)
      //throw new NotFoundException()
      //return new Error("404");
    }
    return post;
  }

  @Get()
  async getAll() {
    const allPost = await this.postsService.findAll();
    return allPost;
  }



}
