import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { RequestInputPostType } from '../api/dto/input/create-user.input.model';
// import { Blog, MappedBlogType } from '../domain/blog.entity';

export type NewUserModelType = {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

@Injectable()
export class PostRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAll(): Promise<any | null> {
    // try {
    //   const users = await this.dataSource.query(
    //     `
    //     SELECT * from "Blogs"
    //     ORDER BY "${sortData.sortBy}" ${sortData.sortDirection}
    //     LIMIT $1 OFFSET $2
    //       `,
    //     [sortData.pageSize, (sortData.pageNumber - 1) * sortData.pageSize],
    //   );
    //   if (!users) {
    //     return null;
    //   }
    //   const totalCount = await this.dataSource.query(
    //     `SELECT COUNT(*)
    //     FROM "Blogs"
    //     `,
    //   );
    //   const pagesCount = Math.ceil(totalCount[0].count / sortData.pageSize);
    //   return {
    //     pagesCount: pagesCount,
    //     page: sortData.pageNumber,
    //     pageSize: sortData.pageSize,
    //     totalCount: Number(totalCount[0].count),
    //     // items: users.map(User.userWithOutEmailConfirmationMapper),
    //     items: users,
    //   };
    // } catch (e) {
    //   console.log(e);
    //   return null;
    // }
  }

  async findAllWithPagination(sortData): Promise<any | null> {
    try {
      const posts = await this.dataSource.query(
        `
        SELECT * from "Posts"
        ORDER BY "${sortData.sortBy}" ${sortData.sortDirection}
        LIMIT $1 OFFSET $2
          `,
        [sortData.pageSize, (sortData.pageNumber - 1) * sortData.pageSize],
      );
      if (!posts) {
        return null;
      }
      const totalCount = await this.dataSource.query(
        `SELECT COUNT(*)
        FROM "Posts"
        `,
      );
      const pagesCount = Math.ceil(totalCount[0].count / sortData.pageSize);
      return {
        pagesCount: pagesCount,
        page: sortData.pageNumber,
        pageSize: sortData.pageSize,
        totalCount: Number(totalCount[0].count),
        // items: users.map(User.userWithOutEmailConfirmationMapper),
        items: posts,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findById(postId: string): Promise<any | null> {
    try {
      const post = await this.dataSource.query(
        `SELECT * FROM "Posts" WHERE "id" = $1`,
        [postId],
      );
      if (!post.length) {
        return null;
      }
      return post[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async create(newPostModal: any): Promise<any | null> {
    try {
      const newPost = await this.dataSource.query(
        `
      INSERT INTO "Posts" ("id","title","shortDescription","content","blogName","blogId","createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `,
        [
          newPostModal.id,
          newPostModal.title,
          newPostModal.shortDescription,
          newPostModal.content,
          newPostModal.blogName,
          newPostModal.blogId,
          newPostModal.createdAt,
        ],
      );

      if (!newPost) {
        return null;
      }
      return newPost[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getBlogPosts(sortData: any, blogId?: string): Promise<any | null> {

    try {
      const posts = await this.dataSource.query(
        `
        SELECT * from "Posts"
        WHERE "blogId" = $1
        ORDER BY "${sortData.sortBy}" ${sortData.sortDirection}
        LIMIT $2 OFFSET $3
          `,
        [
          blogId,
          sortData.pageSize,
          (sortData.pageNumber - 1) * sortData.pageSize,
        ],
      );
      if (!posts) {
        return null; 
      }
      const totalCount = await this.dataSource.query(
        `SELECT COUNT(*) FROM "Posts" WHERE "blogId" = $1
        `,
        [blogId],
      );

      console.log("totalCount");
      console.log(totalCount);

      const pagesCount = Math.ceil(totalCount[0].count / sortData.pageSize);
      return {
        pagesCount: pagesCount,
        page: sortData.pageNumber,
        pageSize: sortData.pageSize,
        totalCount: Number(totalCount[0].count),
        // items: users.map(User.userWithOutEmailConfirmationMapper),
        items: posts,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async update(
    updatedPostId: string,
    updatedPostData: RequestInputPostType,
  ): Promise<any | null> {
    try {
      const updatedPost = await this.dataSource.query(
        `UPDATE "Posts" SET "title" = $1, "shortDescription" = $2, "content" = $3 WHERE "id" = $4 RETURNING *`,
        [
          updatedPostData.title,
          updatedPostData.shortDescription,
          updatedPostData.content,
          updatedPostId,
        ],
      );
      if (!updatedPost) {
        return null;
      }
      return updatedPost;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any | null> {
    try {
      const isDelete = await this.dataSource.query(`DELETE FROM "Posts"`);
      if (!isDelete) {
        return null;
      }
      return !!isDelete;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteById(blogId: string): Promise<any | null> {
    try {
      const isDeleted = await this.dataSource.query(
        `DELETE FROM "Posts" WHERE id = $1`,
        [blogId],
      );

      console.log("isDeleted");
      console.log(isDeleted);

      if (isDeleted[1] === 0) {
        return null;
      }
      return !!isDeleted;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
