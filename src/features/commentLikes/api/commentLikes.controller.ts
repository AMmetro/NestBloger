// // import { ApiTags } from '@nestjs/swagger';
// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   HttpCode,
//   Param,
//   ParseIntPipe,
//   Post,
//   Query,
//   Req,
//   Res,
//   UseGuards,
//   Request,
//   BadRequestException,
//   Put,
//   NotFoundException,
// } from '@nestjs/common';
// // import { UsersRepository } from '../infrastructure/users.repository';
// import { basicSortQuery } from 'src/base/utils/sortQeryUtils';
// // import { QueryUserInputModel, RequestInputUserType, UserCreateModel } from './dto/input/create-user.input.model';
// import { ObjectId } from 'mongodb';
// // import { UsersQueryRepository } from '../infrastructure/users.query-repository';
// // import { UserCreateModel } from './models/input/create-user.input.model';
// // import { UserOutputModel } from './models/output/user.output.model';
// // import { UsersService } from '../application/users.service';
// // import { NumberPipe } from '../../../common/pipes/number.pipe';
// import { Response } from 'express';
// import { CommentLikesServices } from '../application/commentLikes.service';

// // Tag для swagger
// // @ApiTags('Users')
// @Controller('comments')
// // Установка guard на весь контроллер
// // @UseGuards(OptioanlAuthGuard)
// export class CommentLikesController {
//   // usersService: UsersService;
//   constructor(private readonly commentLikesServices: CommentLikesServices) {}

//   //   @Get(':id')
//   //   @UseGuards(OptioanlAuthGuard)
//   //   @HttpCode(201)
//   //   async getComment(
//   //     @Req() req: any,
//   //     @Res() res: Response,
//   //     @Param('id') commentsId: string,
//   //     // @Res({ passthrough: true }) res: Response,
//   //   ): Promise<any> {
//   //     const userOptionalId = req.user?.userId || null;
//   //     if (!commentsId) {
//   //       throw new BadRequestException([
//   //         { message: 'not found commentsId', field: 'commentsId' },
//   //       ]);
//   //     }
//   //     const result = await this.postCommentsService.composePostComment(
//   //       commentsId,
//   //       userOptionalId,
//   //     );
//   //     if (!result) {
//   //       throw new BadRequestException([
//   //         { message: 'wrong creating comment', field: 'comment' },
//   //       ]);
//   //     }
//   //     return res.status(200).send(result);
//   //   }

//   //   @Put(':commentsId/like-status')
//   //   @UseGuards(JwtAuthGuard)
//   //   @HttpCode(204)
//   //   async addLike(
//   //     @Req() req: any,
//   //     @Res() res: Response,
//   //     @Param('commentsId') commentsId: string,
//   //     // @Res({ passthrough: true }) res: Response,
//   //   ): Promise<any> {
//   //     const userOptionalId = req.user?.id || null;
//   //     if (!commentsId) {
//   //       throw new BadRequestException([
//   //         { message: 'not found commentsId', field: 'commentsId' },
//   //       ]);
//   //     }
//   //     const result = await this.postCommentsService.composePostComment(
//   //       commentsId,
//   //       userOptionalId,
//   //     );
//   //     if (!result) {
//   //       throw new NotFoundException([
//   //         { message: 'wrong creating comment', field: 'comment' },
//   //       ]);
//   //     }
//   //     return res.sendStatus(204);
//   //   }
// }
