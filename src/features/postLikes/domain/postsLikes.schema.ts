import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Posts } from 'src/features/posts/domain/post.entity';
import { Users } from 'src/features/users/domain/user.entity';



import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, BaseEntity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

/** В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
* можно применить class NamingStrategy для авто-присваивания имен 
* double click Entity для получения всех свойств
**/ 

@Entity('post_like')
export class PostLike extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")  
  id: string;

  // @Column({nullable:true})  
  // userId: string;  // auto transformed to varchar (255)

  @Column({nullable:true})
  myStatus: string;
 
  @CreateDateColumn()
  addedAt: Date; 

  //**
  //* поле со ссылкой на post, если его явно не задовать то создаться в таблие 
  //* из связи ManyToOne автоматически 
  //**
  @Column("uuid")  
  postId: string;

  @Column("uuid")  
  userId: string;

  @ManyToOne(()=> Posts, (postType)=> postType.postLike)
  //* @JoinColumn({name:"post_Custom"}) можно задать имя связи-ссылки иначе = post + Id  
  @JoinColumn() 
  post: Posts; //* ссылка которую потом указываю при джоине например 

  // @ManyToOne(()=> Users, (u)=> u.postLike)
  // @JoinColumn() 
  // userId: Users; 

 
  @ManyToOne(()=> Users, (u)=> u.postLike)
  @JoinColumn() 
  /***************************************
  ** добовляет Id к имени (ДЛЯ ManyToOne)
  ** и с этим именем добовляется в таблицу
  ***************************************/
  user: Users; 

}
