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
      id: post.id,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogName: post.blogName,
      blogId: post.blogId,
      createdAt: post.createdAt,
      // isMembership: post.isMembership,
    };
  }
}

export type postsSortDataType = {
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};



export type OutputPostsType = {
    id: string,
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    extendedLikesInfo: {
      likesCount: number,
      dislikesCount: number,
      myStatus: string,
      newestLikes: [
        {
          addedAt: Date,
          userId: string,
          login: string
        }
      ]
    }
};

export type OutputBlogPostsType = {
  pagesCount: number;
  page: number;
  pageSize: number;
  totalCount: number;
  items: OutputPostsType[];
};







