// import { Injectable } from '@nestjs/common';
// import { plainToInstance } from 'class-transformer';
// import DatabaseService from 'src/database/postgress/database.service';
// // import UsersModel from './users.model';
// // import UsersDto from './post.dto';

// class UsersModel {
//   id: number;
//   email: string;
//   // @Expose({ name: 'content' }) ????
//   password: string;
//   banned: boolean;
//   banReason: null;
// }

// @Injectable()
// export class UsersSQLRepository {
//   constructor(private readonly databaseService: DatabaseService) {}

//   async getAll() {
//     const databaseResponse = await this.databaseService.runQuery(`
//       SELECT * FROM users
//     `);
//     return plainToInstance(UsersModel, databaseResponse.rows);
//   }

//   async create(userData: any) {
//     const databaseResponse = await this.databaseService.runQuery(
//       `
//       INSERT INTO users (
//         email,
//         password,
//         banned,
//         "createdAt",
//         "updatedAt"
//       ) VALUES (
//         $1,
//         $2,
//         $3,
//         now(),
//         now()
//       ) RETURNING *
//     `,
//       [userData.email, userData.password, false],
//     );

//     const userId = databaseResponse.rows[0].id;
//     const role = await this.databaseService.runQuery(
//       `
//       SELECT id from roles where value = 'user'`,
//     );
//     const roleId = role.rows[0].id;

//     console.log('-------databaseResponse-------');
//     console.log(userId);
//     console.log('-------roleId-------');
//     console.log(roleId);

//     const updateUserRoles = await this.databaseService.runQuery(
//       `
//     INSERT INTO posts (
//       userId,
//       roleId
//     ) VALUES (
//       $1,
//       $2
//     ) RETURNING *
//   `,
//       [userId, roleId],
//     );

//     console.log('-------updateUserRoles-------');
//     console.log(updateUserRoles);

//     // return plainToInstance(UsersModel, databaseResponse.rows[0]);
//   }
// }

// export default UsersSQLRepository;
