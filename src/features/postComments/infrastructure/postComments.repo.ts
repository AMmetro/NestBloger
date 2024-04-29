import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';
import { Injectable } from '@nestjs/common';
import { PostCommentMoongoose } from '../domain/postsComment.schema';
import { PostComment } from '../domain/postCommentTypes';
import { SortDataType } from 'src/features/users/api/dto/input/create-user.input.model';

@Injectable()
export class PostCommentsRepository {
  constructor(
    @InjectModel(PostCommentMoongoose.name)
    private postCommentModel: Model<PostComment>,

    // @InjectModel(Post.name) private postModel: Model<Post>
  ) {}

  async findComment(id: string): Promise<any | null> {
    // console.log('============newComment=========');
    // console.log(newComment);
    try {
      const postComment = await this.postCommentModel.findById(id);
      // const postComment = await this.postCommentModel.find();
      // console.log('============postComment=========');
      // console.log(postComment);
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
      //   return postLikes.map((like) => PostLike.mapper(like));
      return PostComment.mapper(postComment);
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async update(newComment: any): Promise<any | null> {
    try {
      //**
      //*  const Comment =  CommentInstance.findOne({_id:id})
      //*  const Comment.content = updateContent
      //*  await CommentInstance.save()
      //**
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
        // items: comments,
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
      //   return postLikes.map((like) => PostLike.mapper(like));
      return deletedComment;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
