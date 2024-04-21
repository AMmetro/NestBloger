// import { InjectModel } from '@nestjs/mongoose';
// import { Post } from './posts.schema';
// import { Post as PostClass, postsSortDataType } from './posts.types';
// import { Model } from 'mongoose';
// import { Injectable } from '@nestjs/common';
// import { ObjectId } from 'mongodb';

// @Injectable()
// export class PostRepository {
//   constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

//   async findById(postId: string): Promise<Post | null> {
//     try {
//       const post = await this.postModel.findById(postId);
//       if (!post) {
//         return null;
//       }
//       return PostClass.mapper(post);
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   }

//   async deleteAll(): Promise<any> {
//     try {
//       const post = await this.postModel.deleteMany();
//       return post;
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   }

//   async update(postId: string, updatedPostData: any): Promise<boolean> {
//     try {
//       const postForUpd = await this.postModel.updateOne(
//         { _id: new ObjectId(postId) },
//         { $set: { ...updatedPostData } },
//       );
//       return !!postForUpd.modifiedCount;
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   }

//   async getBlogPosts(
//     postsSortData: postsSortDataType,
//     blogId?: string,
//     // ): Promise<PaginationType<OutputPostTypeMapper> | null> {
//   ): Promise<any | null> {
//     const { sortBy, sortDirection, pageNumber, pageSize } = postsSortData;
//     let filter = {};
//     if (blogId) {
//       filter = { blogId: blogId };
//     }
//       try {
//         const posts = await this.postModel
//           .find(filter)
//           .sort({ [sortBy]: sortDirection })
//           .skip((pageNumber - 1) * pageSize)
//           .limit(pageSize)
//           .lean();
//         const totalCount = await this.postModel.countDocuments(filter);
//         const pagesCount = Math.ceil(totalCount / pageSize);
//         return {
//           pagesCount: pagesCount,
//           page: pageNumber,
//           pageSize: pageSize,
//           totalCount: totalCount,
//           items: posts.map(PostClass.mapper),
//         };
//       } catch (error) {
//         console.log(error);
//         return null;
//       }
//     }
  

//   // async getBlogPosts(blogId: string): Promise<any | null> {
//   //   try {
//   //     const blogPosts = await this.postModel.find({ blogId: blogId });
//   //     // if (!blogPosts) {
//   //     //   return null;
//   //     // }
//   //     return blogPosts;
//   //     // return PostClass.mapper(post);
//   //   } catch (e) {
//   //     console.log(e);
//   //     return null;
//   //   }
//   // }


//   // используетсяли гдето ????????
//   async findAll(): Promise<any | null> {
//     try {
//       const posts = await this.postModel.find();
//       if (!posts) {
//         return null;
//       }
//       return posts;
//       // return PostClass.mapper(post);
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   }

//   async create(newPost): Promise<any | null> {
//     try {
//       const newPosts = new this.postModel(newPost);
//       newPosts.save();
//       const mappedPost = PostClass.mapper(newPosts);
//       if (!mappedPost) {
//         return null;
//       }
//       return mappedPost;
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   }


//   async deleteById(postId: string): Promise<boolean | null> {
//     try {
//       const isDeleted = await this.postModel.deleteOne({
//         _id: new ObjectId(postId),
//       });
//       return !!isDeleted.deletedCount;
//     } catch (e) {
//       console.log(e);
//       return null;
//     }
//   }


// }


