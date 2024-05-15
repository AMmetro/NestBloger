import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { User } from '../api/dto/output/user.output.model';

@Injectable()
export class SaRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async findAll(sortData): Promise<any | null> {
    // console.log('sortData');
    // console.log(sortData);
    // {
    //     sortBy: 'createdAt',
    //     sortDirection: 'desc',
    //     pageNumber: 1,
    //     pageSize: 10,
    //     searchEmailTerm: null,
    //     searchLoginTerm: null
    //   }

    try {
      const users = await this.dataSource.query(
        `
        SELECT * from "Users" LIMIT $1 OFFSET $2
          `,
        [sortData.pageSize, (sortData.pageNumber - 1) * sortData.pageSize],
      );
      if (!users) {
        return null;
      }

      const totalCount = await this.dataSource.query(
        `SELECT COUNT(*) FROM "Users"`,
      );

      const pagesCount = Math.ceil(totalCount / sortData.pageSize);
      return {
        pagesCount: pagesCount,
        page: sortData.pageNumber,
        pageSize: sortData.pageSize,
        totalCount: totalCount[0].count,
        items: users.map(User.userWithOutEmailConfirmationMapper),
        // items: users,
      };

      //     console.log('users');
      //     console.log(users);
      //   return users;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async createUser(
    login: string,
    email: string,
    password: string,
  ): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `
      INSERT INTO "Users" ("login", "password", "email")
      VALUES ($1, $2, $3) 
      `,
        [login, email, password],
      );
      console.log('user');
      console.log(user);

      if (!user) {
        return null;
      }

      //   console.log('responce');
      //   console.log(responce);
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any | null> {
    try {
      const user = await this.dataSource.query(`DELETE FROM "Users"`);
      console.log('user');
      console.log(user);

      if (!user) {
        return null;
      }

      //   console.log('responce');
      //   console.log(responce);
      return !!user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
