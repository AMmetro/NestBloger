import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

// type emailConfirmationType = {
//   confirmationCode: string;
//   expirationDate: any;
//   isConfirmed: boolean;
// }

@Schema()
export class emailConfirmation {
  @Prop({ default: '111111' })
  confirmationCode: string;
  @Prop({ default: '111111' })
  expirationDate: number;
  @Prop({ default: '111111' })
  isConfirmed: string;
}

@Schema()
export class User {
  @Prop({ required: true })
  login: string;
  @Prop({ required: true })
  passwordHash: number;
  @Prop({ required: true })
  passwordSalt: string;
  @Prop({ required: true })
  email: string;
  @Prop({ required: true })
  createdAt: string;
  @Prop({ /* { required: true } */ default: {} })
  emailConfirmation: emailConfirmation;
}

export const UserSchema = SchemaFactory.createForClass(User);
