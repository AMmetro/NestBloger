
import { Posts } from 'src/features/posts/domain/post.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';


// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity("Blogs")
export class BlogEntity { 
 
  @PrimaryGeneratedColumn("uuid") 
  id: string; 
  
  @Column({collation: "C"})
  name: string;

  @Column()
  description: string; 

  @Column()
  websiteUrl: string;

  @Column()
  createdAt: Date;

  @Column()
  isMembership: boolean;

  @OneToMany(()=> Posts, (postObj)=> postObj.blog)
  post: Posts[];
 
}

export class Blog {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
  ) {}

  static mapper(blog): MappedBlogType {
    return {
      id: blog.id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    };
  }
}

export class BlogDto {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
  ) {}
}

export class createPostDTO {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
  ) {}
}

export interface MappedBlogType {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: Date;
  isMembership: boolean;
}
