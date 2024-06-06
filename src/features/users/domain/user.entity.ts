import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ default: true })
  isActive: boolean;
 
  // @OneToMany(type => Photo, photo => photo.user)
  // photos: Photo[];

}

// @@ ---------- entity for mongoDB ----------------------------------------
// export type UserDocument = HydratedDocument<UserMongoose>;

// @Schema()
// export class EmailConfirmation {
//   @Prop()
//   confirmationCode: string;
//   @Prop()
//   expirationDate: Date;
//   @Prop()
//   isConfirmed: boolean;
// }

// @Schema()
// export class UserMongoose {
//   @Prop()
//   login: string;
//   @Prop()
//   passwordHash: string;
//   @Prop()
//   passwordSalt: string;
//   @Prop()
//   createdAt: Date;
//   @Prop()
//   email: string;
//   @Prop({ _id: false, type: EmailConfirmation })
//   emailConfirmation: EmailConfirmation;
// }

// export const UserSchema = SchemaFactory.createForClass(UserMongoose);
