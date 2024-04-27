import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentLikeDocument = HydratedDocument<CommentLikeMoongoose>;

@Schema()
export class CommentLikeMoongoose {
  @Prop({ required: true })
  commentId: string;
  @Prop({ required: true })
  userId: string;
  @Prop({ required: true })
  myStatus: string;
  @Prop({ required: true })
  addedAt: Date;
}

export const CommentLikeSchema =
  SchemaFactory.createForClass(CommentLikeMoongoose);
