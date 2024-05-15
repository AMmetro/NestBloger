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
import { SaService } from '../application/sa.service';
// import { UsersService } from '../application/users.service';

@Controller('sa')
export class SaController {
  constructor(private readonly saService: SaService) {}

  @Get('users')
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
    const users = await this.saService.getAll(sortData);
    if (users === null) {
      res.sendStatus(404);
      return;
    }
    return users;
  }

  @Post('users')
  @HttpCode(200)
  async postUsers(
    @Body() reqBody: RequestInputUserType,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, email, password } = reqBody;

    const createdUser = await this.saService.createUser(login, email, password);
    // if (users === null) {
    //   res.sendStatus(404);
    //   return;
    // }
    return createdUser;
  }

  @Delete('users')
  @HttpCode(200)
  async deleteAllUsers(@Res({ passthrough: true }) res: Response) {

    const isDelete = await this.saService.deleteAllUsers();
    // if (users === null) {
    //   res.sendStatus(404);
    //   return;
    // }
    return isDelete;
  }
}
