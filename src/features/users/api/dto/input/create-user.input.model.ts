import { SortDirection } from 'mongodb';

export type QueryUserInputModel = {
  searchEmailTerm?: string;
  searchLoginTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};

export type SortDataType = {
  searchEmailTerm?: string | null;
  searchLoginTerm?: string | null;
  sortBy: string;
  sortDirection: SortDirection;
  pageNumber: number;
  pageSize: number;
};

export type RequestInputUserType = {
  login: string;
  password: string;
  email: string;
};

// import { IsString, Length } from 'class-validator';
// import { Trim } from '../../../../../common/decorators/transform/trim';
// import { IsOptionalEmail } from '../../../../../common/decorators/validate/is-optional-email';

// export class UserCreateModel {
//   @Trim()
//   @IsString()
//   @Length(5, 20, { message: 'Length not correct' })
//   name: string;

//   @IsOptionalEmail()
//   email: string;
// }
