import { IsString, Length } from 'class-validator';
import { Trim } from 'src/common/decorators/transform/trim';
import { IsOptionalEmail } from 'src/common/decorators/validate/is-optional-email';

export type AuthUserInputModel = {
  password: string,
  loginOrEmail: string,
}

export class RegistrationUserInputModel {
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
