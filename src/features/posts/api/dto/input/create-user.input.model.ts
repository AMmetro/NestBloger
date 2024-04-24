// import { SortDirection } from 'mongodb';
// import { IsString, Length } from 'class-validator';
// import { Trim } from '../../../../../common/decorators/transform/trim';
// import { IsOptionalEmail } from 'src/common/decorators/validate/is-optional-email';

import { IsString, Length } from 'class-validator';
import { Trim } from 'src/common/decorators/transform/trim';

export class IncomPostDto {
  @IsString()
  @Trim()
  @Length(1, 30, { message: 'title length is not correct' })
  title: string;

  @IsString()
  @Length(1, 100, { message: 'description length is not correct' })
  shortDescription: string;

  @IsString()
  @Length(1, 1000, { message: '1000 length is not correct' })
  content: string;

  @IsString()
  blogId: string;

//   @IsString()
//   @Matches(
//     new RegExp(
//       '^https://([a-zA-Z0-9_-]+.)+[a-zA-Z0-9_-]+(/[a-zA-Z0-9_-]+)*/?$',
//     ),
//     {
//       message: 'websiteUrl pattern is not correct',
//     },
//   )
//   @Length(1, 100, { message: 'websiteUrl length is not correct' })
//   websiteUrl: string;
}

// export class UserCreateModel {
//   @Trim()
//   @IsString()
//   @Length(3, 10, { message: 'length of login is not correct' })
//   login: string;

//   @IsOptionalEmail()
//   email: string;

//   @Trim()
//   @IsString()
//   @Length(6, 20, { message: 'Incorect length of password' })
//   password: string;
// }

// export type QueryUserInputModel = {
//   searchEmailTerm?: string;
//   searchLoginTerm?: string;
//   sortBy?: string;
//   sortDirection?: SortDirection;
//   pageNumber?: number;
//   pageSize?: number;
// };

// export type searchDataType = {
//   login: string;
//   email: string;
// };

// export type SortDataType = {
//   searchEmailTerm?: string | null;
//   searchLoginTerm?: string | null;
//   sortBy: string;
//   sortDirection: SortDirection;
//   pageNumber: number;
//   pageSize: number;
// };

// export type RequestInputUserType = {
//   login: string;
//   password: string;
//   email: string;
// };
