import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostCommentDocument = HydratedDocument<PostCommentMoongoose>;

@Schema()
export class CommentatorInfoMoongoose {
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  userLogin: string;
}

@Schema()
export class PostCommentMoongoose {
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  content: string;
  @Prop({ required: true })
  commentatorInfo: CommentatorInfoMoongoose;
  @Prop({ required: true })
  createdAt: Date;
}

export const PostCommentSchema =
  SchemaFactory.createForClass(PostCommentMoongoose);
