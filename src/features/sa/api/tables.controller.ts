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
import { DevicesRepository } from 'src/features/devices/infrastructure/devices.repository';
import { PostCommentsRepository } from 'src/features/postComments/infrastructure/postComments.repo';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';

@Controller('sa/tables')
export class SaTablesController {
  constructor(
    private readonly saService: SaService,
    private readonly devicesRepository: DevicesRepository,
    private readonly postCommentsRepository: PostCommentsRepository,
    private readonly commentLikesRepository: CommentLikesRepository,
     private saRepository: SaRepository) {}

  // ----------------------------------------
  @Get()
  @UseGuards(BasicAuthGuard)
  @HttpCode(201)
  async test(
    @Body() reqBody: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {

    // const newCommentLike = { 
    //   userId:"3e08669a-2571-4d1a-9e87-068b0c3e2bfd",
    //   myStatus:"Like",
    //   addedAt: new Date(),
    //   postCommentsId: "e18baf09-75b1-432a-a23f-6f2e9af71ee0",
    //   commentId: "e18baf09-75b1-432a-a23f-6f2e9af71ee0"
    // };
    
    // const updLike = { 
    //   id:"a1202566-7afa-4790-a3ae-169c21be4089",
    //   myStatus:"Dislike3",
    // };

    //   const newComment = { 
    //   content:"222222222",
    //   userId:"3e08669a-2571-4d1a-9e87-068b0c3e2bfd",
    //   createdAt: new Date(),
    //   postId: "1351dbb0-3619-4669-a2e9-498d61051987"
    // };
    
    const createdTable = await this.postCommentsRepository.findComment("038d3d85-2f91-4cae-b114-489e0e29be47");
    return createdTable;
  }
  // ------------------------------------

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
