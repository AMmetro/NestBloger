import { Injectable } from '@nestjs/common';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Not } from 'typeorm';
import { PostComments } from '../domain/postsComment.schema';
import { PostComment } from '../domain/postCommentTypes';


// https://orkhan.gitbook.io/typeorm/docs/entity-manager-api
@Injectable()
export class PostCommentsRepository {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) { }

  async findComment(id: string) {
    try {

      const postComment = await this.entityManager
        .createQueryBuilder(PostComments, 'postComment')
        .leftJoinAndSelect('postComment.user', 'user')
        .select(['postComment', 'user.login']) 
        .where('postComment.id = :id', { id })
        .getOne();

        if (!postComment){return null;}
        // const postComment = {
        //   id: postComment.id,
        //   content: postComment.content,
        //   createdAt: postComment.createdAt,
        //   user: User {userLogin: "hhhhhhhhhhhhhhhhhhhhhhhh"} 
        // }

        // const viewModel = {
        //   id: postComment.id,
        //   content: postComment.content,
        //   createdAt: postComment.createdAt,
        //   commentatorInfo: userLogin 
        // }
        
        const mappedPostComment = {
            id: postComment.id,
            content: postComment.content,
            createdAt: postComment.createdAt,
            commentatorInfo: {userId: postComment.userId, userLogin: postComment.user.login}
        }
      return mappedPostComment;

    } catch (e) {
      console.log(e);
      return null;
    }
  }


    public async create(newComment: any): Promise<any> {
      try {
          const postComments = new PostComments();
          postComments.postId = newComment.postId;
          postComments.content = newComment.content;
          postComments.userId = newComment.userId;
          postComments.createdAt = newComment.createdAt;
            
        const postComment = await this.entityManager.save(PostComments, postComments)

        if (!postComment) {
          return null;
        }

        const res = PostComment.mapper(postComment);
        return res;
        // return postComment 

      } catch (e) {
        console.log(e);
        return null; 
      }
  }

  public async update(updCommentModel: any) {
    try {
      const postComment = await this.entityManager.update(PostComments, updCommentModel.id, {
        content: updCommentModel.content 
        });
      return !!postComment;
    } catch (e) {
      console.log(e);
      return null; 
    }
  }


  async getPostComments(sortData: any): Promise<any> {
    const { id, sortBy, sortDirection, pageNumber, pageSize } = sortData;
    const filter = { postId: id };

    const [comments, totalCount] = await this.entityManager.findAndCount(PostComments, {
      where: filter,
      relations: {user: true},
      order: { [sortBy]: sortDirection },
      skip: (pageNumber - 1) * pageSize,
      take: pageSize 
      });

      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        // items: comments,
        items: comments.map(PostComment.mapperWithCommentator),
      };

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
  
  async deleteAll(): Promise<any | null> {
    try {
      const deletedComment = await this.entityManager.delete(PostComments, {});  
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
