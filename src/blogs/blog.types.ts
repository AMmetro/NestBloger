import { IsString, Length } from "class-validator";

export class Blog {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
  ) {}

  static mapper(blog): MappedBlogType {
                                                  console.log("blog")
                                                  console.log(blog)
    return {
      id: blog._id.toString(),
      name: blog.name,
      description: blog.description,
      websiteUrl: blog.websiteUrl,
      createdAt: blog.createdAt.toISOString(),
      isMembership: blog.isMembership,
    };
  }
}


export class CreateBlogDto {
  @IsString()
  @Length(1, 15, { message: 'name of blog is not correct' })
  name: string;

  @IsString()
  @Length(1, 500, { message: 'description of blog is not correct' })
  description: string;

  @IsString()
  @Length(1, 100, { message: 'Incorect length of password' })
  websiteUrl: string;
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
