// import { SortDirection } from 'mongodb';
// import { IsString, Length } from 'class-validator';
// import { Trim } from '../../../../../common/decorators/transform/trim';
// import { IsOptionalEmail } from 'src/common/decorators/validate/is-optional-email';

import { IsString, Length, Validate } from 'class-validator';
import { Trim } from 'src/common/decorators/transform/trim';
import { CustomBlogIdvalidation } from 'src/common/decorators/validate/isBlogExist';

export class CreatePostModel {
  @IsString()
  @Trim()
  @Length(1, 30, { message: 'title length is not correct' })
  title: string;

  @IsString()
  @Length(1, 100, { message: 'description length is not correct' })
  shortDescription: string;

  @IsString()
  @Trim()
  @Length(1, 1000, { message: '1000 length is not correct' })
  content: string;

  @IsString()
  @Validate(CustomBlogIdvalidation, { message: 'blog id not exists' })
  blogId: string;
}


export class CreatePostForSpecifiedBlogModel {
  @IsString()
  @Trim()
  @Length(1, 30, { message: 'title length is not correct' })
  title: string;

  @IsString()
  @Trim()
  @Length(1, 100, { message: 'description length is not correct' })
  shortDescription: string;

  @IsString()
  @Trim()
  @Length(1, 1000, { message: '1000 length is not correct' })
  content: string;

  // @IsString()
  // userId: string;
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
