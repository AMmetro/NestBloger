import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Devices } from 'src/features/devices/domain/devices.entity';
import { PostComments } from 'src/features/postComments/domain/postsComment.schema';
import { PostLike } from 'src/features/postLikes/domain/postsLikes.schema';

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'; 

// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity()
export class Users {

  @PrimaryGeneratedColumn("uuid")    
  id: string;

  @Column({collation: "C"})
  login: string;

  @Column()
  passwordHash: string; 
 
  @Column()
  email: string; 

  @Column()
  passwordSalt: string;

  @Column({type: "timestamptz"}) 
  createdAt: Date; // @CreateDateColumn()
  
  @Column()
  confirmationCode: string;

  @Column()
  isConfirmed: boolean; 

  @OneToMany(()=>Devices, (incomClass)=> incomClass.user)
  device: Devices[];  

  /****************************************** 
  ** не добовляется в таблицу (ДЛЯ OneToMany)
  ******************************************/
  @OneToMany(()=>PostLike, (pl)=> pl.user)
  postLike: PostLike[]; 

  @OneToMany(()=>PostComments, (pc)=> pc.user)
  user: PostComments[]; 


 
}

