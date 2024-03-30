import { SortDirection } from 'mongodb';

export class Post {
  constructor(
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogName: Date,
    public blogId: Date,
    public createdAt: Date,
  ) {}

  static mapper(post) {
    return {
      id: post._id.toString(),
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogName: post.blogName,
      blogId: post.blogId,
      createdAt: post.createdAt,
      isMembership: post.isMembership,
    };
  }
}

export type postsSortDataType = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

