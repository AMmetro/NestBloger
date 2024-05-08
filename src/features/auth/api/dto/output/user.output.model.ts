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
    };
  }
}
