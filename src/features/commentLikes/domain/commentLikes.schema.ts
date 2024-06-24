import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { PostComments } from 'src/features/postComments/domain/postsComment.schema';



import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

/** В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
* можно применить class NamingStrategy для авто-присваивания имен 
* double click Entity для получения всех свойств 
**/ 

@Entity('postComment_like')
export class CommentLike extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")  
  id: string;

  @Column({nullable:true})  
  userId: string;  // auto transformed to varchar (255)
 
  @Column()
  myStatus: string; 

  @CreateDateColumn()
  addedAt: Date; 

  //**
  //* поле со ссылкой на post, если его явно не задовать то создаться в таблие 
  //* из связи ManyToOne автоматически 
  //**
  @Column("uuid")  
  postCommentsId: string; 

  @ManyToOne(()=> PostComments, (commentType)=> commentType.commentLike)
  //* @JoinColumn({name:"post_Custom"}) можно задать имя связи-ссылки иначе = post + Id  
  // !!!!!! добавить имя
  @JoinColumn() 
  postComments: PostComments[]; //* ссылка которую потом указываю при джоине например 
}







// export type CommentLikeDocument = HydratedDocument<CommentLikeMoongoose>;

// @Schema()
// export class CommentLikeMoongoose {
//   @Prop({ required: true })
//   commentId: string;
//   @Prop({ required: true })
//   userId: string;
//   @Prop({ required: true })
//   myStatus: string;
//   @Prop({ required: true })
//   addedAt: Date;
// }

// export const CommentLikeSchema =
//   SchemaFactory.createForClass(CommentLikeMoongoose);
