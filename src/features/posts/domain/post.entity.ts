import { Prop } from '@nestjs/mongoose';
import { PostComments } from 'src/features/postComments/domain/postsComment.schema';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity()
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

  @Prop({ required: true })
  createdAt: Date; // @CreateDateColumn()

  @OneToMany(()=> PostComments, (postComment)=> postComment.postId)
  postComments: PostComments[];
 
}

// export type PostDocument = HydratedDocument<Post>;

// @Schema()
// export class Post {
//   @Prop({ required: true })
//   title: string;
//   @Prop({ required: true })
//   shortDescription: string;
//   @Prop({ required: true })
//   content: string;
//   @Prop({ required: true })
//   blogName: string;
//   @Prop({ required: true })
//   blogId: string;
//   @Prop({ required: true })
//   createdAt: Date;
// }

// export const PostSchema = SchemaFactory.createForClass(Post);



