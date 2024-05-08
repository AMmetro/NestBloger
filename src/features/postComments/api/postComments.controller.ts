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
  Put,
  NotFoundException,
  ForbiddenException,
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
import {
  IncomLikeStatusDTO,
  likeStatusEnum,
} from 'src/features/postLikes/domain/postLikesTypes';
import { CommentLikesServices } from 'src/features/commentLikes/application/commentLikes.service';
import { CreateCommentDto } from '../domain/postCommentTypes';

// Tag для swagger
// @ApiTags('Users')
@Controller('comments')
// Установка guard на весь контроллер
// @UseGuards(OptioanlAuthGuard)
export class PostCommentsController {
  // usersService: UsersService;
  constructor(
    private readonly postCommentsService: PostCommentsService,
    private readonly commentLikesServices: CommentLikesServices,
  ) {}

  @Get(':id')
  @UseGuards(OptioanlAuthGuard)
  @HttpCode(201)
  async getComment(
    @Req() req: any,
    @Res() res: Response,
    @Param('id') commentsId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userOptionalId = req.user?.userId || null;
    if (!commentsId) {
      throw new BadRequestException([
        { message: 'not found commentsId', field: 'commentsId' },
      ]);
    }
    const result = await this.postCommentsService.composePostComment(
      commentsId,
      userOptionalId,
    );
    if (!result) {
      throw new NotFoundException([
        { message: 'not found comment', field: 'comment' },
      ]);
    }
    return res.status(200).send(result);
  }

  @Get(':id/like-status')
  @UseGuards(OptioanlAuthGuard)
  async getLike(
    @Req() req: any,
    @Res() res: Response,
    @Param('id') commentId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userId = req.user?.id || null;
    if (!commentId) {
      throw new BadRequestException([
        { message: 'not found commentsId', field: 'commentsId' },
      ]);
    }
    const result = await this.postCommentsService.composePostComment(
      commentId,
      userId,
    );
    if (!result) {
      throw new NotFoundException([
        { message: 'wrong creating comment', field: 'comment' },
      ]);
    }
    return res.status(200).send(result);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async addLike(
    @Req() req: any,
    @Res() res: Response,
    @Body() likeModel: IncomLikeStatusDTO,
    @Param('id') commentId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userId = req.user?.userId || null;
    const likeStatus = likeModel.likeStatus;
    if (!likeStatus || !likeStatusEnum.hasOwnProperty(likeStatus)) {
      throw new BadRequestException([
        { message: 'wrong like status', field: 'likeStatus' },
      ]);
    }
    if (!commentId) {
      throw new BadRequestException([
        { message: 'not found commentsId', field: 'commentsId' },
      ]);
    }
    const result = await this.postCommentsService.addLikeToComment(
      commentId,
      likeStatus,
      userId,
    );
    if (!result) {
      throw new NotFoundException([
        { message: 'not found comment', field: 'comment' },
      ]);
    }
    return res.sendStatus(204);
    // return res.send(result);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async updateComment(
    @Req() req: any,
    @Res() res: Response,
    @Body() updContent: CreateCommentDto,
    @Param('id') commentId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userId = req.user?.userId;
    const { content } = updContent;
    if (!commentId) {
      throw new BadRequestException([
        { message: 'not found comment for update', field: 'commentsId' },
      ]);
    }
    const isUpdated = await this.postCommentsService.updateComment(
      commentId,
      userId,
      content,
    );
    if (!isUpdated) {
      throw new NotFoundException([
        { message: 'not found comment', field: 'comment' },
      ]);
    }
    return res.sendStatus(204);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  async deleteComment(
    @Req() req: any,
    @Res() res: Response,
    @Param('id') commentsId: string,
    // @Res({ passthrough: true }) res: Response,
  ): Promise<any> {
    const userId = req.user?.userId || null;
    if (!commentsId) {
      throw new BadRequestException([
        { message: 'not found commentsId', field: 'commentsId' },
      ]);
    }
    const deletedComment = await this.postCommentsService.deleteComment(
      commentsId,
      userId,
    );

    console.log('result in controler');
    console.log(deletedComment);

    if (deletedComment === 403) {
      throw new ForbiddenException([
        { message: 'wrong user id', field: 'comment' },
      ]);
    }
    if (deletedComment === 404) {
      throw new NotFoundException([
        { message: 'wrong comment id', field: 'comment' },
      ]);
    }
    return res.sendStatus(204);
  }
}
