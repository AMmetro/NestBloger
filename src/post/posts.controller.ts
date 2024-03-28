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
} from '@nestjs/common';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  @Post(':id/posts')
  @HttpCode(201)
  async createPost(
    @Param('id') userId: number,
    @Body() reqBody: any,
  ): Promise<any> {

    const createPostModel = {
      title: reqBody.title,
      shortDescription: reqBody.shortDescription,
      content: reqBody.content,
    };

    // const createdPost = await this.postsService.create(userId, createPostModel);
    // const mappedCreatedBlog = Blog.mapper(createdBlog);
    // return mappedCreatedBlog;

    return "createdPost";
  }

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

  // @Get(':id')
  // async findOne(@Param('id') userId: number) {
  //   // const userIdNumber = +userId; ?????
  //   const blog = await this.blogsService.findOne(userId);
  //   const resultBlog = Blog.mapper(blog[0]);
  //   return resultBlog;
  // }

  // @Get()
  // findSpecific(@Query() query: { id: number }): any {
  //   // const userIdNumber = +userId; ?????
  //   return this.blogsService.findOne(query.id);
  // }

  // @Get()
  // findAll(): any {
  //   return this.blogsService.findAll();
  // }
}
