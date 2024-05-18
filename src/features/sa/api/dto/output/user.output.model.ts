type emailConfirmationType = {
  confirmationCode: string;
  expirationDate: any;
  isConfirmed: boolean;
};

export class User {
  constructor(
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
      id: user.id.toString(),
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
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
