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
  Put,
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
import { SaRepository } from '../infrastructure/sa.repository';

@Controller('sa/tables')
export class SaTablesController {
  constructor(private readonly saService: SaService,
     private saRepository: SaRepository) {}

  @Post('create')
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async createTable(
    // @Body() reqBody: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const createdTable = await this.saRepository.createTable();
    return createdTable;
  }

  @Post('fill')
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async fillTable(
    // @Body() reqBody: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const createdTable = await this.saRepository.fillTable();
    return createdTable;
  }

  @Get('left')
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async getlefjoin(
    // @Body() reqBody: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const createdTable = await this.saRepository.getlefjoin();
    return createdTable;
  }


}
