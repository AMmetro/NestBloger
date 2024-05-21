import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Blog, MappedBlogType } from '../domain/blog.entity';

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
export class BlogRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAllByName(sortData): Promise<any | null> {
    console.log('sortData222');
    console.log(sortData);

    try {
      const users = await this.dataSource.query(
        `
        SELECT * from "Blogs"
        WHERE "name" ILIKE $1
        ORDER BY "${sortData.sortBy}" ${sortData.sortDirection === 'asc' ? 'ASC' : 'DESC'}
        LIMIT $2 OFFSET $3
          `,
        [
          sortData.searchNameTerm ? `%${sortData.searchNameTerm}%` : '%',
          sortData.pageSize,
          (sortData.pageNumber - 1) * sortData.pageSize,
        ],
      );

      console.log("users------------------------");
      console.log(users);

      if (!users) {
        return null;
      }
      const totalCount = await this.dataSource.query(
        `SELECT COUNT(*)
         FROM "Blogs"
         WHERE "name" ILIKE $1
        `,
        [sortData.searchNameTerm ? `%${sortData.searchNameTerm}%` : '%'],
      );

      const pagesCount = Math.ceil(totalCount[0].count / sortData.pageSize);
      return {
        pagesCount: pagesCount,
        page: sortData.pageNumber,
        pageSize: sortData.pageSize,
        totalCount: Number(totalCount[0].count),
        // items: users.map(User.userWithOutEmailConfirmationMapper),
        items: users,
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async findById(blogId: string): Promise<MappedBlogType | null> {
    try {
      const blog = await this.dataSource.query(
        `SELECT * FROM "Blogs" WHERE "id" = $1`,
        [blogId],
      );
      if (!blog.length) {
        return null;
      }
      return blog[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async addNewBlogToRepo(newBlogModal: Blog): Promise<any | null> {
    try {
      const newBlog = await this.dataSource.query(
        `
      INSERT INTO "Blogs" ("id","name","description","websiteUrl","isMembership","createdAt")
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *
      `,
        [
          newBlogModal.id,
          newBlogModal.name,
          newBlogModal.description,
          newBlogModal.websiteUrl,
          newBlogModal.isMembership,
          newBlogModal.createdAt,
        ],
      );
      if (!newBlog) {
        return null;
      }
      return newBlog[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  // async confirmRegistration(userId: string): Promise<any | null> {
  //   try {
  //     const user = await this.dataSource.query(
  //       `UPDATE "Users" SET "isConfirmed" = true WHERE "id" = $1 RETURNING *`,
  //       [userId],
  //     );

  //     if (!user) {
  //       return null;
  //     }
  //     return user;
  //   } catch (e) {
  //     console.log(e);
  //     return null;
  //   }
  // }

  async update(
    updatedBlogId: string,
    updatedBlogData: any,
  ): Promise<any | null> {
    try {
      const blogForUpd = await this.dataSource.query(
        `UPDATE "Blogs" SET "name" = $1, "websiteUrl" = $2, "description" = $3 WHERE "id" = $4 RETURNING *`,
        [
          updatedBlogData.name,
          updatedBlogData.websiteUrl,
          updatedBlogData.description,
          updatedBlogId,
        ],
      );
      if (!blogForUpd) {
        return null;
      }
      return blogForUpd;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any | null> {
    try {
      const isDelete = await this.dataSource.query(`DELETE FROM "Blogs"`);
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
        `DELETE FROM "Blogs" WHERE id = $1`,
        [blogId],
      );
      if (!isDeleted) {
        return null;
      }
      return !!isDeleted;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
