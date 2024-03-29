import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.types';
import { Blog, MappedBlogType } from 'src/blogs/blog.types';
import { PostRepository } from './posts.repo';
import { BlogRepository } from 'src/blogs/blog.repo';
import { createPostDTO } from 'src/blogs/blog.types';
import { PostLikesRepository } from 'src/postLikes/postLikes.repo';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    private postRepository: PostRepository,
    private blogRepository: BlogRepository,
    private postLikesRepository: PostLikesRepository,
  ) {}

  async createPost(blogId: number, reqData: createPostDTO) {
    const currentBlog = await this.blogRepository.findById(blogId);
    if (!currentBlog) {
      return null;
    }
    const newPost = {
      title: reqData.title,
      shortDescription: reqData.shortDescription,
      content: reqData.content,
      blogName: currentBlog.name,
      blogId: currentBlog.id,
      createdAt: new Date(),
    };
    const extendedLikesInfo = {
      dislikesCount: 0,
      likesCount: 0,
      myStatus: 'None',
      newestLikes: [],
    };
    const createdPost = await this.postRepository.create(newPost);
    return { ...createdPost, extendedLikesInfo: extendedLikesInfo };
  }

  // !!!!!!!!!!!!!!!!!найти лайки и присоединить их к посту!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  async composePostById(postId: string): Promise<any> {
    const post = await this.postRepository.findById(postId);
    if (!post) {
      return null;
    }
    const postLikes = await this.postLikesRepository.findAllByPostId(postId);
    const newestLikes = await this.postLikesRepository.findNewestLikes(
      postId,
      'like',
    );
    // console.log("currentBlog")
    // console.log(currentBlog)
    const extendedLikesInfo = {
      likesCount: 0,
      dislikesCount: 0,
      myStatus: 'None',
      newestLikes: newestLikes,
      // newestLikes: [
      //   {
      //     addedAt: '2024-03-29T14:00:11.476Z',
      //     userId: 'string',
      //     login: 'string',
      //   },
      // ],
    };

    // console.log('post');
    // console.log(post);
    // console.log('postLikes');
    // console.log(postLikes);
    // const postLikes = await this.likesRepository.findLikesPosts(postId);
    return { ...post, extendedLikesInfo: extendedLikesInfo };
  }

  async findAll(): Promise<any> {
    const allPosts = this.postRepository.findAll();
    return allPosts;
  }

  // async deleteAll(): Promise<any> {
  //   const isDeleted = await this.blogModel.deleteMany();
  //   return isDeleted.deletedCount;
  // }
}
