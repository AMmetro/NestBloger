import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { PostCommentMoongoose } from '../domain/postsComment.schema';
import { PostComment } from '../domain/postCommentTypes';

@Injectable()
export class PostCommentsRepository {
  constructor(
    @InjectModel(PostCommentMoongoose.name)
    private postCommentModel: Model<PostComment>,
  ) {}

  async findComment(id: string): Promise<any | null> {
    try {
      const postComment = await this.postCommentModel.findById(id);
      if (!postComment) {
        return null;
      }
      return PostComment.mapper(postComment);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async create(newComment: any): Promise<any | null> {
    try {
      const postComment = await this.postCommentModel.create(newComment);
      if (!postComment) {
        return null;
      }
      return PostComment.mapper(postComment);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async update(newComment: any): Promise<any | null> {
    try {
      //@@ класс возвращает await this.postCommentModel.find() и у него есть методы
      //@ updateOne и т.п. не возвращает класс с методами
      //@ либо можно создать новый класс:
      //@ const someComment = new this.postCommentModel();
      //@ someComment.save()
      //@ ТАК ЖЕ В САМОМ КЛАССЕ МОЖНО ПОПИСЫВАТЬ МЕТОД SAVE CREATE т.д. и потом вызвать
      //@@
      const commentForUpd = await this.postCommentModel.updateOne(
        { _id: new ObjectId(newComment.id) },
        {
          $set: {
            content: newComment.content,
          },
        },
      );
      return !!commentForUpd.modifiedCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getPostComments(sortData: any): Promise<any> {
    const { id, sortBy, sortDirection, pageNumber, pageSize } = sortData;
    const filter = { postId: id };

    try {
      const comments = await this.postCommentModel
        .find(filter)
        .sort({ [sortBy]: sortDirection })
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();
      const totalCount = await this.postCommentModel.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pagesCount: pagesCount,
        page: pageNumber,
        pageSize: pageSize,
        totalCount: totalCount,
        items: comments.map(PostComment.mapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteOne(commentId: string): Promise<any | null> {
    try {
      const deletedComment =
        await this.postCommentModel.findByIdAndDelete(commentId);
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
