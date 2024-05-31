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
  Req,
  NotFoundException,
} from '@nestjs/common';

import { Response } from 'express';
import { ObjectId } from 'mongodb';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
import { BasicAuthGuard } from 'src/common/guards/basic.guard';
import { PostsService } from 'src/features/posts/application/post.service';
import { OptioanlAuthGuard } from 'src/common/guards/optionalAuth.guard';
import { CreatePostForSpecifiedBlogModel } from 'src/features/posts/api/dto/input/create-user.input.model';
import { BlogsService } from 'src/features/blogs/application/blogs.service';
import { BlogRepository } from 'src/features/blogs/infrastructure/blogs.repository';
import { Blog, IncomBlogDto } from '../domain/blog.entity';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly postsService: PostsService,
    private readonly blogRepository: BlogRepository,
  ) {}

  @Get()
  @UseGuards(OptioanlAuthGuard)
  findAll(@Query() reqQuery: any): any {
    const basicSortData = basicSortQuery(reqQuery);
    const sortData = {
      ...basicSortData,
      searchNameTerm: reqQuery.searchNameTerm ?? null,
    };
    const blogs = this.blogsService.findAll(sortData);
    return blogs;
  }

  @Get('/:id/posts')
  @UseGuards(OptioanlAuthGuard)
  async getBlogPosts(
    @Param('id') blogId: string,
    @Query() reqQuery: any,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
  ) {
    const optionalUserId = req.user?.userId || null;
    const basicSortData = basicSortQuery(reqQuery);
    const blogPosts = await this.blogsService.composeBlogPosts(
      blogId,
      basicSortData,
      optionalUserId,
    );
    if (!blogPosts) {
      res.sendStatus(404);
    }
    return blogPosts;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createBlog(
    @Body() reqBody: IncomBlogDto,
    @Res({ passthrough: true }) res: Response,
  ): Promise<Blog> {
    const createdBlog = await this.blogsService.create(reqBody);
    if (!createdBlog) {
      throw new NotFoundException()
    }
    const mappedCreatedBlog = Blog.mapper(createdBlog);
    return mappedCreatedBlog;
  }

  @Post('/:id/posts')
  @HttpCode(201)
  async createPost(
    @Param('id') blogId: string,
    @Body() reqBody: CreatePostForSpecifiedBlogModel,
    @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    if (!blogId) {
      res.sendStatus(400);
    }
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

  @Put(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Param('id') blogId: string,
    @Body() reqBody: IncomBlogDto,
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

  @Delete(':id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteById(
    @Param('id') blogId: string,
    @Res() res: Response,
  ): Promise<any> {
    if (!ObjectId.isValid(blogId)) {
      return res.sendStatus(404);
    }
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      return res.sendStatus(404);
    }
    const isDeleted = await this.blogRepository.deleteById(blogId);
    if (!isDeleted) {
      return res.sendStatus(404);
    }
    return res.sendStatus(204);
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
    // if (!ObjectId.isValid(blogId)) {
    //   res.sendStatus(404);
    //   return;
    // }
    const blog = await this.blogRepository.findById(blogId);
    if (!blog) {
      res.sendStatus(404);
    }
    return blog;
  }
}
