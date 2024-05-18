// import {UserDocument} from "../../../domain/user.entity";

// export class UserOutputModel {
//     id: string;
//     name: string
//     email: string
// }

// // MAPPERS

// export const UserOutputModelMapper = (user: UserDocument): UserOutputModel => {
//     const outputModel = new UserOutputModel();

//     outputModel.id = user.id;
//     outputModel.name = user.name;
//     outputModel.email = user.email;

//     return outputModel;
// };


type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export class User {
  constructor(
    public id: number,
    public login: string,
    public passwordHash: string,
    public passwordSalt: string,
    public email: string,
    public createdAt: Date,
    public emailConfirmation: emailConfirmationType,
  ) {}

  static userMapper(user) {
    return {
      id: user._id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      emailConfirmation: {
        confirmationCode: user.emailConfirmation.confirmationCode,
        expirationDate: user.emailConfirmation.expirationDate,
        isConfirmed: user.emailConfirmation.isConfirmed,
      },
    };
  }

  static userWithOutEmailConfirmationMapper(user) {
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt.toISOString(),
    };
  }

  static userNoEmailConfirmation(user) {
    return {
      id: user.id,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  static userAuthMe(user) {
    return {
      id: user.id.toString(),
      login: user.login,
      email: user.email,
    };
  }
}

export type OutputUserType = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  emailConfirmation: emailConfirmationType;
};
