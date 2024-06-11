import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Devices } from 'src/features/devices/domain/devices.entity';

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, OneToMany } from 'typeorm'; 

// В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
// можно применить class naming strategy для авто-присваивания имен 
@Entity()
export class Users {

  @PrimaryGeneratedColumn("uuid")    
  id: number;

  @Column({collation: "C"})
  // @Column()
  login: string;

  @Column()
  passwordHash: string; 
 
  @Column()
  email: string; 

  @Column()
  passwordSalt: string;

  @Column({type: "timestamptz"}) 
  createdAt: Date; // @CreateDateColumn()
  
  @Column()
  confirmationCode: string;

  @Column()
  isConfirmed: boolean;

  @OneToMany(()=>Devices, (device)=> device.user)
  device: Devices[];
 
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
