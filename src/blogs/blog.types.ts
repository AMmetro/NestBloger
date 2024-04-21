import { IsString, Length, Matches } from 'class-validator';
import { Trim } from 'src/common/decorators/transform/trim';

export class Blog {
  constructor(
    public name: string,
    public description: string,
    public websiteUrl: string,
    public createdAt: Date,
    public isMembership: boolean,
  ) {}

  static mapper(blog): MappedBlogType {
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

export class IncomBlogDto {
  @IsString()
  @Trim()
  @Length(1, 15, { message: 'blog name length is not correct' })
  name: string;

  @IsString()
  @Trim()
  @Length(1, 500, { message: 'description length is not correct' })
  description: string;

  @IsString()
  @Matches(
    new RegExp(
      '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
    ),
    {
      message: 'websiteUrl pattern is not correct',
    },
  )
  @Length(1, 100, { message: 'websiteUrl length is not correct' })
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
