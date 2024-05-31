import { Injectable } from '@nestjs/common';
import { SortDirection } from 'mongodb';
import { OutputBasicSortQueryType } from 'src/base/utils/sortQeryUtils';
// import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import { PostsService } from 'src/features/posts/application/post.service';
import { PostRepository } from 'src/features/posts/infrastructure/post.repository';
// import { PostLikesServices } from 'src/features/postLikes/application/postLikes.service';
import { BlogDto } from '../domain/blog.entity';
import { BlogRepository } from '../infrastructure/blogs.repository';
import { randomUUID } from 'crypto';
import { UpdateBlogType } from '../api/dto/input/create-user.input.model';

type SortDataType = {
  searchNameTerm?: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

@Injectable()
export class BlogsService {
  constructor(
    private postRepository: PostRepository,
    private blogRepository: BlogRepository,
    // private postLikesRepository: PostLikesRepository,
    // private postLikesServices: PostLikesServices,
    private postsService: PostsService,
  ) {}

  async findAll(sortData: SortDataType): Promise<any> {
    const createdBlog = this.blogRepository.getAllByName(sortData);
    return createdBlog;
  }

  async create(dto: BlogDto): Promise<any> {
    const newBlog = {
      id: randomUUID(),
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
    const createdBlog = await this.blogRepository.addNewBlogToRepo(newBlog);
    return createdBlog;
  }

  async composeBlogPosts(
    blogId: string,
    basicSortData: OutputBasicSortQueryType,
    optionalUserId: string | null,
  ): Promise<any> {
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      return null;
    }
    const blogPostsWithPagination = await this.postRepository.getBlogPosts(
      basicSortData,
      blogId,
    );

    console.log("-----------blogPostsWithPagination---------");
    console.log(blogPostsWithPagination);

    const postsWithLikes = await this.postsService.addLikesToPosts(
      blogPostsWithPagination.items,
      optionalUserId,
    );

    console.log("-----------postsWithLikes---------");
    console.log(postsWithLikes);

    return { ...blogPostsWithPagination, items: postsWithLikes };
  }

  async findOne(id: string): Promise<any> {
    // const createdBlog = this.blogModel.findById(id);
    // return createdBlog;
  }

  async updateBlog(
    updatedBlogId: string,
    updatedBlogModel: UpdateBlogType,
  ): Promise<boolean> {
    const updatedBlog = await this.blogRepository.update(
      updatedBlogId,
      updatedBlogModel,
    );
    return updatedBlog;
  }

  async deleteBlog(blogId: string): Promise<any> {
    const isBlogExist = await this.blogRepository.findById(blogId);
    // if (!isBlogExist) {
    //   return null;
    // }
    const isDeleted = await this.blogRepository.deleteById(blogId);
    if (!isDeleted) {
      return null;
    }
    return isDeleted;
  }

  async deleteAll(): Promise<any> {
    const isDeleted = await this.blogRepository.deleteAll();
    return isDeleted.deletedCount;
  }
}
