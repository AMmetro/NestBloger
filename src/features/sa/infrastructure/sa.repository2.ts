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
      const storage = await this.dataSource.query(
        `CREATE TABLE IF NOT EXISTS public."storageUnit"
        (
            storage_id SERIAL PRIMARY KEY,
            storage_adress varchar(50)
        ); 
        `
      );

      const productCategory = await this.dataSource.query(
        `CREATE TABLE IF NOT EXISTS public."productCategory"
        (
            productCategory_id SERIAL PRIMARY KEY,
            productCategory_name varchar(50)
        ); 
        `
      );

      const storage_productCategory = await this.dataSource.query(
        `CREATE TABLE IF NOT EXISTS public."storage_productCategory"
        (
            storage_id INT,
            productCategory_id INT, 
            PRIMARY KEY (storage_id, productCategory_id),
            foreign key (storage_id) references public."storageUnit"(storage_id),
            foreign key (productCategory_id) references public."productCategory"(productCategory_id)
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
      
      const fillTable1 = await this.dataSource.query(
        `
        insert into public."storageUnit" 
        (storage_adress) 
        values ('ul_1'), ('ul_2'), ('ul_3');
        `
      );
      
      const fillTable2 = await this.dataSource.query(
        `
        insert into public."productCategory"
        (productCategory_name) 
        values ('electroo'), ('food'), ('sport');
        `
      );
      const fillTable3 = await this.dataSource.query(
        `
        insert into public."storage_productCategory"
        (productCategory_id, storage_id) 
        values (1,1), (2,2), (3,3);
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
       SELECT pc.productcategory_id, pc.productcategory_name, su.storage_adress
	     FROM public."productCategory" pc
	     LEFT JOIN "storage_productCategory" spc ON pc.productcategory_id = spc.productCategory_id
	     LEFT JOIN "storageUnit" su ON spc.storage_id = su.storage_id;
       
       -- select productCategory_name, storage_adress from productCategory left join storageUnit on productCategory_id.id = storage.adress_id
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
