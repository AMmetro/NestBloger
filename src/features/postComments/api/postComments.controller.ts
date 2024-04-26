// import { ApiTags } from '@nestjs/swagger';
import {
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
  Request,
  BadRequestException,
} from '@nestjs/common';
// import { UsersRepository } from '../infrastructure/users.repository';
import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
// import { QueryUserInputModel, RequestInputUserType, UserCreateModel } from './dto/input/create-user.input.model';
import { ObjectId } from 'mongodb';
// import { UsersQueryRepository } from '../infrastructure/users.query-repository';
// import { UserCreateModel } from './models/input/create-user.input.model';
// import { UserOutputModel } from './models/output/user.output.model';
// import { UsersService } from '../application/users.service';
// import { NumberPipe } from '../../../common/pipes/number.pipe';
import { Response } from 'express';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BasicAuthGuard } from 'src/common/guards/basic.guard';
import { OptioanlAuthGuard } from 'src/common/guards/optionalAuth.guard';
import { PostCommentsService } from '../application/postComments.service';

// Tag для swagger
// @ApiTags('Users')
@Controller('comments')
// Установка guard на весь контроллер
// @UseGuards(OptioanlAuthGuard)
export class PostCommentsController {
  // usersService: UsersService;
  constructor(
    private readonly postCommentsService: PostCommentsService,
     ) {}

  @Get(':commentsId')
  @UseGuards(OptioanlAuthGuard)
  @HttpCode(201)
  async getComment(
    @Req() req: any,
    @Res() res: Response,
    @Param('commentsId') commentsId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userOptionalId = req.user?.id || null;
    if (!commentsId) {
      throw new BadRequestException([
        { message: 'not found commentsId', field: 'commentsId' },
      ]);
    }
    const result = await this.postCommentsService.composePostComment(
      commentsId,
      userOptionalId,
    );

    //   throw new BadRequestException([
    //     { message: 'wrong creating comment', field: 'comment' },
    //   ]);
    // }
    // return res.sendStatus(201).send(newComment);

    return result;
  }
}
