import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PostCommentDocument = HydratedDocument<PostCommentMoongoose>;

@Schema()
export class PostCommentMoongoose {
  @Prop({ required: true })
  postId: string;
  @Prop({ required: true })
  userId: string;
  // @Prop({ required: true })
  // myStatus: string;
  @Prop({ required: true })
  addedAt: Date;
}

export const PostCommentSchema =
  SchemaFactory.createForClass(PostCommentMoongoose);
