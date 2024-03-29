import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Delete,
  Res,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog, BlogDto, createPostDTO } from './blog.types';
import { PostsService } from 'src/post/posts.service';
import { Response } from 'express';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
  ) {}

  @Post()
  @HttpCode(201)
  async createBlog(@Body() dto: BlogDto): Promise<Blog> {
    const createdBlog = await this.blogsService.create(dto);

    // console.log("createdBlog")
    // console.log(createdBlog)

    const mappedCreatedBlog = Blog.mapper(createdBlog);
    return mappedCreatedBlog;
  }

  @Put(':id')
  updateBlog(@Param('id') userId: number, @Body() model: {}): any {
    return;
  }


  @Post(':id/posts')
  @HttpCode(201)
  async createPost(
    @Param('id') blogId: number,
    @Body() reqBody: createPostDTO,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const createPostModel = {
      title: reqBody.title,
      shortDescription: reqBody.shortDescription,
      content: reqBody.content, 
    };
    const createdPost = await this.postsService.createPost(
      blogId,
      createPostModel,
    );
    if (!createdPost) {
      res.sendStatus(404)
    }
    return createdPost;
  }

  @Delete()
  async deleteAll(): Promise<any> {
    const countDelDoc = await this.blogsService.deleteAll();
    return countDelDoc;
  }

  @Get(':id')
  async findOne(@Param('id') userId: number) {
    // const userIdNumber = +userId; ?????
    const blog = await this.blogsService.findOne(userId);
    const resultBlog = Blog.mapper(blog[0]);
    return resultBlog;
  }


  @Get()
  findAll(): any {
    return this.blogsService.findAll();
  }
}
