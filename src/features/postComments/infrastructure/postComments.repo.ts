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

    // @InjectModel(Post.name) private postModel: Model<Post>
  ) {}

  async findComment(id: string): Promise<any | null> {
    // console.log('============newComment=========');
    // console.log(newComment);
    try {
      const postComment = await this.postCommentModel.findById(id);
      // const postComment = await this.postCommentModel.find();
      // console.log('============postId=========');
      // console.log(postId);
      if (!postComment) {
        return null;
      }
      //   return postLikes.map((like) => PostLike.mapper(like));
      return postComment;
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
      return !!commentForUpd.matchedCount;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteOne(commentId: string): Promise<any | null> {
    try {
      const isDeleted =
        await this.postCommentModel.findByIdAndDelete(commentId);
      if (!isDeleted) {
        return null;
      }
      //   return postLikes.map((like) => PostLike.mapper(like));
      return isDeleted;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
