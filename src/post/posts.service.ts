import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './posts.types';
// import { Blog, MappedBlogType } from 'src/blogs/blog.types';
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

  async createPost(blogId: string, reqData: createPostDTO) {
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
  async composePostById(postId: string, userOptionalId: null): Promise<any> {
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
    };
    return { ...post, extendedLikesInfo: extendedLikesInfo };
  }

  // async findAll(): Promise<any> {
  //   const allPosts = this.postRepository.findAll();
  //   return allPosts;
  // }




  async composeAllPosts(
    postsRequestsSortData: any,
    userId: null | string,
  ): Promise<any | null> {
    const allPostsObject = await this.postRepository.getBlogPosts(
      postsRequestsSortData,
    );
    if (!allPostsObject) {
      return null;
    }






    // const postsWithLikes = await Promise.all(
    //   allPostsObject.items.map(async (post) => {

    //     const newestLikes = await PostLikesModel.find({
    //       postId: post.id,
    //       myStatus: likeStatusEnum.Like,
    //     })
    //       // 1 asc старая запись в начале
    //       // -1 descend новая в начале
    //       .sort({ addedAt: -1 })
    //       .limit(3)
    //       .lean();

    //     const newestLikesWithUser = await newestLikesServices.addUserDataToLike(newestLikes)

    //     const countLikes = await PostLikesServices.countLikes(post.id, userId)

    //     const extendedLikesInfo = {
    //       newestLikes: newestLikesWithUser,
    //       likesCount: countLikes.likesCount,
    //       dislikesCount: countLikes.dislikesCount,
    //       myStatus: countLikes.myStatus,
    //     };
    //     return { ...post, extendedLikesInfo };
    //   })
    // );

    // return {
    //   status: ResultCode.Success,
    //   data: { ...allPostsObject, items: postsWithLikes },
    // };
  }












  



  async findAll(): Promise<any> {
    const allPosts = this.postRepository.findAll();
    return allPosts;
  }

  async update(updatedPostId: string, updatePostModel: any): Promise<boolean> {
    const postForUpd = this.postRepository.findById(updatedPostId);
    if (!postForUpd) {
      return null;
    }
    const postIsUpdated = this.postRepository.update(updatedPostId, updatePostModel);
    return postIsUpdated;
  }

  // async deleteAll(): Promise<any> {
  //   const isDeleted = await this.blogModel.deleteMany();
  //   return isDeleted.deletedCount;
  // }
}
