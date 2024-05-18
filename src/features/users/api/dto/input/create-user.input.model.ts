import { SortDirection } from 'mongodb';
import { IsString, Length } from 'class-validator';
import { Trim } from '../../../../../common/decorators/transform/trim';
import { IsOptionalEmail } from 'src/common/decorators/validate/is-optional-email';

export class UserCreateModel {
  @Trim()
  @IsString()
  @Length(3, 10, { message: 'length of login is not correct' })
  login: string;

  @IsOptionalEmail()
  email: string;

  @Trim()
  @IsString()
  @Length(6, 20, { message: 'Incorect length of password' })
  password: string;
}

export type QueryUserInputModel = {
  searchEmailTerm?: string;
  searchLoginTerm?: string;
  sortBy?: string;
  sortDirection?: SortDirection;
  pageNumber?: number;
  pageSize?: number;
};

export type searchDataType = {
  login: string;
  email: string;
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
  isConfirmed?: boolean;
};
