import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/features/sa/api/dto/output/user.output.model';
import { DataSource } from 'typeorm';
import { searchDataType } from '../api/dto/input/create-user.input.model';

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
export class UsersRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async getAll(sortData): Promise<any | null> {
    try {
      const users = await this.dataSource.query(
        `
        SELECT * from "Users" 
        WHERE "login" ILIKE  $1 OR "email" ILIKE $2 
        ORDER BY "${sortData.sortBy}" ${sortData.sortDirection} 
        LIMIT $3 OFFSET $4
          `,
        [
          sortData.searchLoginTerm ? `%${sortData.searchLoginTerm}%` : '%',
          sortData.searchEmailTerm ? `%${sortData.searchEmailTerm}%` : '%',
          sortData.pageSize,
          (sortData.pageNumber - 1) * sortData.pageSize,
        ],
      );
      if (!users) {
        return null;
      }
      const totalCount = await this.dataSource.query(
        `SELECT COUNT(*) 
        FROM "Users"
        WHERE "login" ILIKE  $1 OR "email" ILIKE $2
        `,
        [
          sortData.searchLoginTerm ? `%${sortData.searchLoginTerm}%` : '%',
          sortData.searchEmailTerm ? `%${sortData.searchEmailTerm}%` : '%',
        ],
      );

      const pagesCount = Math.ceil(totalCount[0].count / sortData.pageSize);
      return {
        pagesCount: pagesCount,
        page: sortData.pageNumber,
        pageSize: sortData.pageSize,
        totalCount: Number(totalCount[0].count),
        items: users.map(User.userWithOutEmailConfirmationMapper),
      };
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getById(userId: string): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `SELECT * FROM "Users" WHERE id = $1`,
        [userId],
      );
      if (!user.length) {
        return null;
      }
      return user[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async addNewUserToRepo(newUserModal: NewUserModelType): Promise<any | null> {
    try {
      const user = await this.dataSource.query( 
        `
      INSERT INTO "Users" ("login", "passwordHash", "passwordSalt", "email", "createdAt", "confirmationCode", "isConfirmed" )
      VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *
      `,
        [
          newUserModal.login,
          newUserModal.passwordHash,
          newUserModal.passwordSalt,
          newUserModal.email,
          newUserModal.createdAt,
          newUserModal.emailConfirmation.confirmationCode,
          newUserModal.emailConfirmation.isConfirmed,
        ],
      );
      if (!user) {
        return null;
      }
      return user[0].id;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async confirmRegistration(userId: string): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `UPDATE "Users" SET "isConfirmed" = true WHERE "id" = $1 RETURNING *`,
        [userId],
      );

      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async updateConfirmationCode(
    userId: string,
    confirmationCode: string,
  ): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `UPDATE "Users" SET "confirmationCode" = $1 WHERE "id" = $2 RETURNING *`,
        [confirmationCode, userId],
      );
      if (!user) {
        return null;
      }
      return user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getOneByLoginOrEmail(searchData: searchDataType): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `
        SELECT * FROM "Users" WHERE login = $1 OR email = $2 
      `,
        [searchData.login, searchData.email],
      );
      if (!user) {
        return null;
      }
      return user[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getByConfirmationCode(code: string): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `
        SELECT * FROM "Users" WHERE "confirmationCode" = $1 
      `,
        [code],
      );
      return user[0];
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteAll(): Promise<any | null> {
    try {
      const user = await this.dataSource.query(`DELETE FROM "Users"`);
      if (!user) {
        return null;
      }
      return !!user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async deleteUserById(userId: string): Promise<any | null> {
    try {
      const user = await this.dataSource.query(
        `DELETE FROM "Users" WHERE id = $1`,
        [userId],
      );
      if (!user) {
        return null;
      }
      return !!user;
    } catch (e) {
      console.log(e);
      return null;
    }
  }
}
