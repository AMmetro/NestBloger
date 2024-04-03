import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<UserMongoose>;

// public login: string,
// public passwordHash: string,
// public passwordSalt: string,
// public email: string,
// public createdAt: Date,
// public emailConfirmation: emailConfirmationType,

// type emailConfirmationType = {
//   confirmationCode: string;
//   expirationDate: any;
//   isConfirmed: boolean;
// };

@Schema()
export class EmailConfirmation {
  @Prop()
  confirmationCode: string;
  @Prop()
  expirationDate: Date;
  @Prop()
  isConfirmed: boolean;
}

@Schema()
export class UserMongoose {
  @Prop()
  login: string;
  @Prop()
  passwordHash: string;
  @Prop()
  passwordSalt: string;
  @Prop()
  createdAt: Date;
  @Prop()
  email: string;
  @Prop({ _id: false, type: EmailConfirmation })
  emailConfirmation: EmailConfirmation;

  //TODO: replace with new this()
  // static create(name: string, email: string | null) {
  //   const user = new User();

  //   user.name = name;
  //   user.email = email ?? `${randomUUID()}_${name}@it-incubator.io`;

  //   return user;
  // }
}

export const UserSchema = SchemaFactory.createForClass(UserMongoose);
