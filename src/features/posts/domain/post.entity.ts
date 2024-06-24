import { Prop } from '@nestjs/mongoose';
import { BlogEntity } from 'src/features/blogs/domain/blog.entity';
import { PostComments } from 'src/features/postComments/domain/postsComment.schema';
import { PostLike } from 'src/features/postLikes/domain/postsLikes.schema';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity("Posts")
export class Posts {

  @PrimaryGeneratedColumn("uuid") 
  id: string;
  
  @Column()
  title: string;

  @Column()
  shortDescription: string; 

  @Column()
  content: string;
 
  @Column()
  blogName: string;

  @Column("uuid")
  blogId: string;

  @Column({ nullable: true })
  createdAt: Date; // @CreateDateColumn()

  @OneToMany(()=> PostComments, (postComment)=> postComment.post)
  postComments: PostComments[];

  @OneToMany(()=> PostLike, (postLike)=> postLike.postId)
  postLike: PostLike[];

  @ManyToOne(()=> BlogEntity, (blogObj)=> blogObj.post)
  blog: BlogEntity[];
 
}




