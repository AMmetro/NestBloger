import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Users } from 'src/features/users/domain/user.entity';

export class Device {
  userId: string;
  ip: string;
  title: string;
  lastActiveDate: Date;
  tokenCreatedAt: Date;
  deviceId: string;

  static mapper(device): any {
    return {
      ip: device.ip,
      title: device.title,
      userId: device.userId,
      deviceId: device.deviceId,
      lastActiveDate: device.lastActiveDate,
      tokenCreatedAt: device.tokenCreatedAt,
    };
  }
  static allDevicesMapper(device): any {
    return {
      ip: device.ip,
      title: device.title,
      deviceId: device.deviceId,
      lastActiveDate: device.lastActiveDate,
    };
  }
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn } from 'typeorm';

/** В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
* можно применить class NamingStrategy для авто-присваивания имен 
* double click Entity для получения всех свойств
**/ 
@Entity('devices')
export class Devices {
  // ("uuid") или другие типы можно задать
  @PrimaryGeneratedColumn("uuid") 
  id: number;

  @Column({nullable:true})
  userId: number;

  @Column({nullable:true})
  ip: string;  // auto transformed to varchar (255)

  @Column({nullable:true})
  title: string;

  @CreateDateColumn()
  tokenCreatedAt: Date;

  @UpdateDateColumn()
  lastActiveDate: Date;

  @Column("uuid")
  deviceId: number;
 
  @ManyToOne(()=> Users, (user)=> user.device)
  @JoinColumn({name:"userId"})
  user: Users;


}


// ----------------- mongo DB entity -------------------------------
// export type DevicesDocument = HydratedDocument<DevicesMongoose>;

// @Schema()
// export class DevicesMongoose {
//   @Prop()
//   userId: string;
//   @Prop()
//   ip: string;
//   @Prop()
//   title: string;
//   @Prop()
//   lastActiveDate: Date;
//   @Prop()
//   tokenCreatedAt: Date;
//   @Prop()
//   deviceId: string;
// }

// export const DevicesSchema = SchemaFactory.createForClass(DevicesMongoose);
