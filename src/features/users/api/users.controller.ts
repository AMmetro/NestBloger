// import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
import {
  QueryUserInputModel,
  UserCreateModel,
} from './dto/input/create-user.input.model';
import { ObjectId } from 'mongodb';
// import { UsersQueryRepository } from '../infrastructure/users.query-repository';
// import { UserCreateModel } from './models/input/create-user.input.model';
// import { UserOutputModel } from './models/output/user.output.model';
// import { UsersService } from '../application/users.service';
// import { NumberPipe } from '../../../common/pipes/number.pipe';
// import { AuthGuard } from '../../../common/guards/auth.guard';
import { Request, Response } from 'express';
import { UsersService } from '../application/users.service';
import { User } from './dto/output/user.output.model';

@Controller('users')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
  ) {}

  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query() reqQuery: QueryUserInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const basicSortData = basicSortQuery(reqQuery);
    const sortData = {
      ...basicSortData,
      searchEmailTerm: reqQuery.searchEmailTerm ?? null,
      searchLoginTerm: reqQuery.searchLoginTerm ?? null,
    };
    const users = await this.usersRepository.getAll(sortData);
    if (users === null) {
      res.sendStatus(404);
      return;
    }
    return users;
  }

  @Post()
  @HttpCode(201)
  async createUser(
    @Body() createModel: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, password, email } = createModel;
    const InputUserModel = {
      login: login,
      password: password,
      email: email,
    };

    const createdUser = await this.usersService.createNewUser(InputUserModel);
    if (!createdUser) {
      res.sendStatus(404);
      return;
    }
    return User.userNoEmailConfirmation(createdUser);
  }

  @Delete(':id')
  async deleteUserById(
    @Param('id') userId: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!ObjectId.isValid(userId)) {
      res.sendStatus(404);
      return;
    }
    const isUser = await this.usersRepository.getById(userId);
    if (!isUser) {
      res.sendStatus(404);
      return;
    }
    const isDeleted = await this.usersRepository.deleteUserById(userId);
    if (isDeleted === null) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(204);
    return;
  }
}
