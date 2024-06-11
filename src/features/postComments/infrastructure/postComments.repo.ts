import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Not } from 'typeorm';
import { PostComments } from '../domain/postsComment.schema';
import { userInfo } from 'os';


// https://orkhan.gitbook.io/typeorm/docs/entity-manager-api
@Injectable()
export class PostCommentsRepository {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  async findComment(id: any) {
    try {
      const postComment = await this.entityManager.findOne(PostComments, { where: { postId: id } });
      if (!postComment) {
        return null;
      }
      const combinedPostComment = {...postComment,
         commentatorInfo: {...postComment, userLogin: "tempName"}
         }
      return combinedPostComment;
      // return PostComment.mapper(postComment);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // ждет uuid тоесть стринг и с ним работает 
    public async create(newComment: any): Promise<any> {
      try {
          const postComments = new PostComments();
          postComments.postId = newComment.postId;
          postComments.content = newComment.content;
          postComments.userId = newComment.userId;
          postComments.createdAt = newComment.createdAt;
            
        const postComment = await this.entityManager.create(newComment); 
        if (!postComment) {
          return null;
        }
        // return PostComment.mapper(postComment);
      } catch (e) {
        console.log(e);
        return null; 
      }
  }

  public async update(updCommentModel: any) {
    try {
      const postComment = await this.entityManager.update(PostComments, updCommentModel.id, updCommentModel.content, );
      return !!postComment;
    } catch (e) {
      console.log(e);
      return null; 
    }
  }


  async getPostComments(sortData: any): Promise<any> {
    // const { id, sortBy, sortDirection, pageNumber, pageSize } = sortData;
    // const filter = { postId: id };

    // try {
    //   const comments = await this.postCommentModel
    //     .find(filter)
    //     .sort({ [sortBy]: sortDirection })
    //     .skip((pageNumber - 1) * pageSize)
    //     .limit(pageSize)
    //     .lean();
    //   const totalCount = await this.postCommentModel.countDocuments(filter);
    //   const pagesCount = Math.ceil(totalCount / pageSize);

    //   return {
    //     pagesCount: pagesCount,
    //     page: pageNumber,
    //     pageSize: pageSize,
    //     totalCount: totalCount,
    //     items: comments.map(PostComment.mapper),
    //   };
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  }

  async deleteOne(commentId: string): Promise<any | null> {
    try {
      const deletedComment = await this.entityManager.delete(PostComments, commentId);  
      if (!deletedComment) {
        return null;
      }
      return deletedComment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

}
