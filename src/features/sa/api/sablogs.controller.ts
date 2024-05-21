// import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
import {
  QueryUserInputModel,
  UserCreateModel,
} from './dto/input/create-user.input.model';

import { Request, Response } from 'express';
import { SaService } from '../application/sa.service';
import { BasicAuthGuard } from 'src/common/guards/basic.guard';
import { BlogRepository } from 'src/features/blogs/infrastructure/blogs.repository';
import { BlogsService } from 'src/features/blogs/application/blogs.service';
import { IncomBlogDto } from 'src/features/blogs/domain/blog.entity';
import { RequestInputPostType } from 'src/features/posts/api/dto/input/create-user.input.model';
import { PostsService } from 'src/features/posts/application/post.service';

@Controller('sa/blogs')
export class SaBlogsController {
  constructor(
    private readonly saService: SaService,
    private readonly blogsService: BlogsService,
    private readonly blogRepository: BlogRepository,
    private readonly postsService: PostsService,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  async getAllBlogs(
    @Res({ passthrough: true }) res: Response,
    @Query() reqQuery: QueryUserInputModel,
  ) {
    const basicSortData = basicSortQuery(reqQuery);
    const sortData = {
      ...basicSortData,
      searchEmailTerm: reqQuery.searchEmailTerm ?? null,
      searchLoginTerm: reqQuery.searchLoginTerm ?? null,
    };
    const blog = await this.blogRepository.getAllByName(sortData);
    if (blog === null) {
      res.sendStatus(404);
      return;
    }
    return blog;
  }

  @Get('/:id')
  @HttpCode(200)
  async getBlog(
    @Param() blogId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!blogId) {
      throw new BadRequestException();
    }
    const blog = await this.blogRepository.findById(blogId);
    if (blog === null) {
      res.sendStatus(404);
      return;
    }
    return blog;
  }

  @Post()
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createNewBlog(
    @Body() reqBody: IncomBlogDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const createdBlog = await this.blogsService.create(reqBody);
    if (!createdBlog) {
      res.sendStatus(404);
      return;
    }
    return createdBlog;
  }

  @Post('/:blogId/posts')
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createNewPostForBlog(
    @Body() reqBody: RequestInputPostType,
    @Res({ passthrough: true }) res: Response,
    @Param('blogId') blogId: string,
  ) {
    if (!blogId) {
      throw new BadRequestException();
    }
    const createdPost = await this.postsService.createPost(blogId, reqBody);
    if (!createdPost) {
      res.sendStatus(404);
      return;
    }
    return createdPost;
  }

  @Put('/:blogId/posts/:postId')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updatePostForBlog(
    @Body() reqBody: RequestInputPostType,
    @Res({ passthrough: true }) res: Response,
    @Param() params: { blogId: string; postId: string },
  ) {
    if (!params.blogId && !params.postId) {
      throw new BadRequestException();
    }
    const updatedPost = await this.postsService.update(params.postId, reqBody);
    if (!updatedPost) {
      res.sendStatus(404);
      return;
    }
    return updatedPost;
  }

  @Put('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async updateBlog(
    @Body() reqBody: IncomBlogDto,
    @Param('id') blogId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
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
    const createdBlog = await this.blogsService.updateBlog(
      blogId,
      updatedBlogModel,
    );
    if (!createdBlog) {
      res.sendStatus(404);
      return;
    }
    return createdBlog;
  }

  @Delete('/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteBlog(
    @Param('id') blogId: string,
    // @Res({ passthrough: true }) res: Response,
    @Res() res: Response,
  ) {
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      res.sendStatus(404);
    }
    const isDelete = await this.blogsService.deleteBlog(blogId);
    if (!isDelete) {
      res.sendStatus(404);
      return;
    }
    // ???????????????????????????????
    res.sendStatus(204);
    // return isDelete;
  }
}
