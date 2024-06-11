import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Posts } from 'src/features/posts/domain/post.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity()
export class PostComments {

  @PrimaryGeneratedColumn("uuid")
  postId: number;
  
  @Column()
  content: string;

  @Column()
  userId: string;

  @Column()
  createdAt: Date; // @CreateDateColumn()
  
  @ManyToOne(()=>Posts, (post)=> post.id)
  @JoinColumn({name:"id"})
  post: Posts[];
 
}

// ---------- MongoDB schema ----------------------- 
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
