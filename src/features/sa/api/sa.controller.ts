// import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
import {
  QueryUserInputModel,
  RequestInputUserType,
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
// import { UsersService } from '../application/users.service';
// import { SaService } from '../application/sa.service';

@Controller('sa')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
export class SaController {
  constructor() {} // private readonly usersService: UsersService, // private readonly saService: SaService,

  @Get()
  @HttpCode(200)
  async getAllUsers(
    @Query() reqQuery: QueryUserInputModel,
    // @Res({ passthrough: true }) res: Response,
  ) {
    // return 'users22';

    const basicSortData = basicSortQuery(reqQuery);
    const sortData = {
      ...basicSortData,
      searchEmailTerm: reqQuery.searchEmailTerm ?? null,
      searchLoginTerm: reqQuery.searchLoginTerm ?? null,
    };
    // const users = await this.saService.getAll(sortData);
    //   if (users === null) {
    //     res.sendStatus(404);
    //     return;
    //   }
    //   return users;
  }
}
