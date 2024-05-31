import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from 'src/features/sa/api/dto/output/user.output.model';
import { DataSource } from 'typeorm';
import { searchDataType } from '../api/dto/input/create-user.input.model';

export type NewUserModelType = {
  login: string;
  email: string;
  passwordHash: string;
  passwordSalt: string;
  createdAt: Date;
  emailConfirmation: {
    confirmationCode: string;
    expirationDate: Date;
    isConfirmed: boolean;
  };
};

@Injectable()
export class SaRepository { 
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async createTable(): Promise<any | null> {

    try {
      const create1 = await this.dataSource.query(
        `CREATE TABLE public."adress"
        (
            id SERIAL PRIMARY KEY,
            citizen varchar(50),
            street varchar(100)
        ); 
        `
      );

      const create2 = await this.dataSource.query(
        `CREATE TABLE public."citizen"
        (
            id SERIAL PRIMARY KEY,
            secondName varchar(50),
            citizenName varchar(100),
            adress_id bigint, 
            foreign key (adress_id) references public."adress"(id)
        );
        `
      );

    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async fillTable(): Promise<any | null> {
    try {
      const fillData = await this.dataSource.query(
        `
        insert into public.adress 
        (citizen, street) 
        values ('adres_sit_1', 'adres_street_1'),
        ('adres_sit_2', 'adres_street_2'),
        ('adres_sit_3', 'adres_street_3');
        
        insert into public.citizen 
        (secondname, citizenname, adress_id)
        values ('citizen_secondname_1', 'citizen_citizenname_1', 1 ),
        ('citizen_secondname_2', 'citizen_citizenname_2', 2),
        ('citizen_secondname_3', 'citizen_citizenname_3', 2);
        `
      );
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async getlefjoin(): Promise<any | null> {
    try {
      const select = await this.dataSource.query(
       `
       select citizen, secondname from adress left join citizen on adress.id = citizen.adress_id
       -- where adress.id = citizen.adress_id
       `
      );
      return select
    } catch (e) {
      console.log(e);
      return null;
    }
  }



}
