// import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Query,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
import {
  QueryUserInputModel,
  UserCreateModel,
} from './dto/input/create-user.input.model';

import { Request, Response } from 'express';
import { SaService } from '../application/sa.service';
import { BasicAuthGuard } from 'src/common/guards/basic.guard';

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
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async postUsers(
    @Body() reqBody: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, email, password } = reqBody;

    if (!login || !email || !password) {
      throw new BadRequestException();
    }

    const createdUser = await this.saService.createUser(login, email, password);
    if (!createdUser) {
      res.sendStatus(404);
      return;
    }
    return createdUser;
  }

  @Delete('users')
  @UseGuards(BasicAuthGuard)
  @HttpCode(200)
  async deleteAllUsers(@Res({ passthrough: true }) res: Response) {
    const isDelete = await this.saService.deleteAllUsers();
    // if (users === null) {
    //   res.sendStatus(404);
    //   return;
    // }
    return isDelete;
  }

  @Delete('users/:id')
  @UseGuards(BasicAuthGuard)
  @HttpCode(204)
  async deleteUser(
    @Res({ passthrough: true }) res: Response,
    @Param('id') userId: string,
  ) {
    if (!userId) {
      throw new UnauthorizedException();
    }
    const isDelete = await this.saService.deleteUser(userId);
    if (!isDelete) {
      throw new NotFoundException();
    }
    return isDelete;
  }
}
