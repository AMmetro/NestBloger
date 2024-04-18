import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BlogMongoose } from './blogs.schema'; 
import { PostRepository } from 'src/post/posts.repo';
import { BlogRepository } from './blog.repo';
import { PostLikesServices } from 'src/postLikes/postLikes.service';
import { SortDirection } from 'mongodb';
import { PostsService } from 'src/post/posts.service';
import { OutputBasicSortQueryType } from 'src/base/utils/sortQeryUtils';
import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import { BlogDto } from './blog.types';

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
    @InjectModel(BlogMongoose.name) private blogModel: Model<BlogMongoose>,
    private postRepository: PostRepository,
    private blogRepository: BlogRepository,
    private postLikesRepository: PostLikesRepository,
    private postLikesServices: PostLikesServices,
    private postsService: PostsService,
  ) {}

  async findAll(sortData: SortDataType): Promise<any> {
    const createdBlog = this.blogRepository.getAllByName(sortData);
    return createdBlog;
  }

  async create(dto: BlogDto): Promise<BlogMongoose> {
    const newBlog = {
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      createdAt: new Date(),
      isMembership: false,
    };
    const createdBlog = new this.blogModel(newBlog);
    return createdBlog.save();
  }

  async composeBlogPosts(
    blogId: string,
    basicSortData: OutputBasicSortQueryType,
  ): Promise<any> {
    const userId = null;
    const isBlogExist = await this.blogRepository.findById(blogId);
    if (!isBlogExist) {
      return null;
    }
    const blogPostsWithPagination = await this.postRepository.getBlogPosts(
      basicSortData,
      blogId,
    );

    const postsWithLikes = await this.postsService.addLikesToPosts(
      blogPostsWithPagination.items,
      null,
    );
    // ----------------перенести в пост сервис ?----------------------------------------------------

    // const postsWithLikes = await Promise.all(
    //   blogPostsWithPagination.items.map(async (post) => {
    //     const newestLikes = await this.postLikesRepository.findNewestLikes(
    //       post.postId,
    //       'like',
    //     );
    //     // const newestLikesWithUser =
    //     //   await newestLikesServices.addUserDataToLike(newestLikes);
    //     const countLikes = await this.postLikesServices.countPostLikes(
    //       post.id,
    //       userId,
    //     );
    //     const extendedLikesInfo = {
    //       likesCount: countLikes.likesCount,
    //       dislikesCount: countLikes.dislikesCount,
    //       myStatus: countLikes.myStatus,
    //       // newestLikes: newestLikesWithUser,
    //       newestLikes: newestLikes,
    //     };
    //     return { ...post, extendedLikesInfo: extendedLikesInfo };
    //   }),
    // );

    return { ...blogPostsWithPagination, items: postsWithLikes };
  }

  async findOne(id: string): Promise<any> {
    const createdBlog = this.blogModel.findById(id);
    return createdBlog;
  }

  async updateBlog(
    updatedBlogId: string,
    updatedBlogModel: any, //UpdateBlogType,
  ): Promise<boolean> {
    const updatedBlog = await this.blogRepository.update(
      updatedBlogId,
      updatedBlogModel,
    );
    return updatedBlog;
  }

  async deleteAll(): Promise<any> {
    const isDeleted = await this.blogModel.deleteMany();
    return isDeleted.deletedCount;
  }
}
