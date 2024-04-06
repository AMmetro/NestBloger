import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { UsersService } from './users.service';
import { UsersRepository } from '../users/infrastructure/users.repository';
import { UserMongoose } from '../users/domain/user.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';

describe('AppController', () => {
  // const repo = new UsersRepository(@InjectModel(UserMongoose.name))

  // const userServices = new UsersService(repo);

  const createData = {
    login: 'login',
    password: 'password',
    email: 'email',
  };

  it('eeee', async () => {
    expect(5).toBe(5);
  });

  // const result = userServices.create(createData);
  // let appController: AppController;

  // beforeEach(async () => {
  //   const app: TestingModule = await Test.createTestingModule({
  //     controllers: [AppController],
  //     providers: [AppService],
  //   }).compile();

  //   appController = app.get<AppController>(AppController);
  // });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.getHello()).toBe('Hello World!');
  //   });
  // });
});
