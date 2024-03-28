import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog, BlogDto, createPostDTO } from './blog.types';
import { PostsService } from 'src/post/posts.service';

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
    const mappedCreatedBlog = Blog.mapper(createdBlog);
    return mappedCreatedBlog;
  }

  @Put(':id')
  updateBlog(@Param('id') userId: number, @Body() model: {}): any {
    return;
  }


  // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  @Post(':id/posts')
  @HttpCode(201)
  async createPost(
    @Param('id') blogId: number,
    @Body() reqBody: createPostDTO,
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

    // const mappedCreatedBlog = Blog.mapper(createdBlog);
    // return mappedCreatedBlog;

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

  // @Get()
  // findSpecific(@Query() query: { id: number }): any {
  //   // const userIdNumber = +userId; ?????
  //   return this.blogsService.findOne(query.id);
  // }

  @Get()
  findAll(): any {
    return this.blogsService.findAll();
  }
}
