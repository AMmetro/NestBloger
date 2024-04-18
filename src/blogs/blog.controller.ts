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
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { Blog, CreateBlogDto, createPostDTO } from './blog.types';
import { PostsService } from 'src/post/posts.service';
import { Response } from 'express';
import { BlogRepository } from './blog.repo';
import { ObjectId } from 'mongodb';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
import { BasicAuthGuard } from 'src/common/guards/basic.guard';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogRepository: BlogRepository,
  ) {}

  @Get()
  findAll(@Query() reqQuery: any): any {
    const basicSortData = basicSortQuery(reqQuery);
    const sortData = {
      ...basicSortData,
      searchNameTerm: reqQuery.searchNameTerm ?? null,
    };
    const blogs = this.blogsService.findAll(sortData);
    return blogs;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createBlog(
    @Body() reqBody: CreateBlogDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Blog> {
    const createdBlog = await this.blogsService.create(reqBody);
    if (!createdBlog) {
      res.sendStatus(404);
    }
    const mappedCreatedBlog = Blog.mapper(createdBlog);
    return mappedCreatedBlog;
  }

  @Get(':id/posts')
  async getBlogPosts(
    @Param('id') blogId: string,
    @Query() reqQuery: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    const basicSortData = basicSortQuery(reqQuery);
    const blogPosts = await this.blogsService.composeBlogPosts(
      blogId,
      basicSortData,
    );
    if (!blogPosts) {
      res.sendStatus(404);
    }
    return blogPosts;
  }

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() reqBody: any,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(404);
      return;
    }
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      res.sendStatus(404);
    }
    const { name, description, websiteUrl } = reqBody;
    const updatedBlogModel = {
      name: name,
      description: description,
      websiteUrl: websiteUrl,
    };
    const updatedBlog = await this.blogsService.updateBlog(
      blogId,
      updatedBlogModel,
    );
    return updatedBlog;
  }

  @Post(':id/posts')
  @HttpCode(201)
  async createPost(
    @Param('id') blogId: string,
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
      res.sendStatus(404);
    }
    return createdPost;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteById(
    @Param('id') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(404);
      return;
    }
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      res.sendStatus(404);
    }
    const isDeleted = await this.blogRepository.deleteById(blogId);
    if (!isDeleted) {
      res.sendStatus(404);
    }
    return isDeleted;
  }

  @Delete()
  @UseGuards(BasicAuthGuard)
  async deleteAll(): Promise<any> {
    const countDelDoc = await this.blogsService.deleteAll();
    return countDelDoc;
  }

  @Get(':id')
  async findOne(
    @Param('id') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!ObjectId.isValid(blogId)) {
      res.sendStatus(404);
      return;
    }
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      res.sendStatus(404);
    }
    const blog = await this.blogsService.findOne(blogId);
    const resultBlog = Blog.mapper(blog);
    return resultBlog;
  }
}
