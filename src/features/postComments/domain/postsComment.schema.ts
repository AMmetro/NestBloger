import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CommentLike } from 'src/features/commentLikes/domain/commentLikes.schema';
import { PostLike } from 'src/features/postLikes/domain/postsLikes.schema';
import { Posts } from 'src/features/posts/domain/post.entity';
import { Users } from 'src/features/users/domain/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity()
export class PostComments {

  @PrimaryGeneratedColumn("uuid")
  id: number;
 
  @Column()
  content: string; 
 
  @Column()
  userId: string;  

  @Column()
  createdAt: Date; // @CreateDateColumn()

  //**
  //* поле со ссылкой на post, если его явно не задовать то создаться в таблие 
  //* из связи ManyToOne автоматически 
  //** 
  @Column("uuid") 
  postId: number;
 
  @ManyToOne(()=>Posts, (post)=> post.postComments)
  @JoinColumn({name:"postId"})   
  post: Posts[];

  @OneToMany(()=>CommentLike, (post)=> post.postComments)
  commentLike: CommentLike[];
 
  @ManyToOne(()=>Users, (u)=> u.user)
  // @JoinColumn({name:"postId"})   
  user: Users;


}

