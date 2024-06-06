import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/features/users/domain/user.entity';
import { EntityManager, Repository } from 'typeorm';



// https://orkhan.gitbook.io/typeorm/docs/entity-manager-api


@Injectable()
export class DevicesRepository {
  public constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,
  ) {}

  public async getAllAndCount(): Promise<any> {
    // try {
    //   const result = await this.entityManager.findAndCount(User, {
    //     where: {},
    //   });

    //   return result;
    // } catch (error) {
    //   console.log(error);

    //   return [[], 0];
    // }
  }

  public async getUser(eee: any) {
    // return this.findOne({ where: { id } });
  }
  create(eee: any) {
    // return this.findOne({ where: { id } });
  }

  getById(eee: any) {
    // return this.find();
  }
  getAll(eee: any) {
    // return this.find();
  }
  refreshDeviceTokens(eee: any) {
    // return this.find();
  }
  deleteDeviceById(eee: any) {
    // return this.find();
  }
  deleteAll() {
    // return this.find();
  }
  deleteAllOtherDevices(eee: any) {
    // return this.find();
  }

  createUser(eee: any) {
    // return this.save(user);
  }


















}


// export interface UserRepository extends Repository<User> {
//   this: Repository<User>;
//   getUsers(): Promise<User[]>;
//   getUser(id: number): Promise<User>;
//   createUser(user: { firstName: string; lastName: string; isActive: boolean });
// }


// @Injectable()
// export class DevicesRepository {
//   public constructor(
//     @InjectRepository(User)
//     private readonly posts: Repository<User>
//   ) {}
 
//   public async getAllAndCount(): Promise<[User[], number]> {
//     try {
//       const result = await this.posts.findAndCount();
 
//       return result;
//     } catch (error) {
//       console.log(error);
 
//       return [[], 0];
//     }
//   }
 
//   // ... other methods
// }


// export const DevicesRepositoryOld: Pick<UserRepository, any> = {
//   getUser(this: Repository<User>, id) {
//     return this.findOne({ where: { id } });
//   },
//   create(this: Repository<User>, id) {
//     return this.findOne({ where: { id } });
//   },

//   getById(this: Repository<User>) {
//     return this.find();
//   },
//   getAll(this: Repository<User>) {
//     return this.find();
//   },
//   refreshDeviceTokens(this: Repository<User>) {
//     return this.find();
//   },
//   deleteDeviceById(this: Repository<User>) {
//     return this.find();
//   },
//   deleteAll(this: Repository<User>) {
//     return this.find();
//   },
//   deleteAllOtherDevices(this: Repository<User>) {
//     return this.find();
//   },

//   createUser(this: Repository<User>, user) {
//     return this.save(user);
//   },
// };