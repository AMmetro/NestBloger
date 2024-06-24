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

import { Entity, Column, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, JoinColumn, BaseEntity, PrimaryColumn } from 'typeorm';

/** В скобочках Entity можно задать имя для таблицы в БД, иначе возметься из имени класса.toLowerCase()
* можно применить class NamingStrategy для авто-присваивания имен 
* double click Entity для получения всех свойств
**/ 
@Entity('devices')
export class Devices extends BaseEntity {

  @PrimaryColumn("uuid")  
  deviceId: string;

  @Column({nullable:true})  
  ip: string;  // auto transformed to varchar (255)

  @Column({nullable:true})
  title: string;
 
  @CreateDateColumn()
  tokenCreatedAt: Date; 

  @UpdateDateColumn()
  lastActiveDate: Date;  

  //**
  //* поле со ссылкой на юзера, если его явно не задовать то создаться в таблие 
  //* из связи ManyToOne автоматически 
  //**
  @Column() 
  userId: string;

  @ManyToOne(()=> Users, (incomData)=> incomData.device)
  //* @JoinColumn({name:"userId_Custom"}) можно задать имя связи-ссылки иначе = user + Id  
  @JoinColumn() 
  user: Users; //* ссылка которую потом указываю при джоине например 
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
