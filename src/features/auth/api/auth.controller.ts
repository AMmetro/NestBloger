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
import { Request, Response } from 'express';
import { AuthUserInputModel } from './dto/input/auth.input.model';
import { UsersService } from 'src/features/users/application/users.service';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { LocalAuthGuard } from 'src/common/guards/local.guard';

// Tag для swagger
// @ApiTags('Users')
@Controller('auth')
// Установка guard на весь контроллер
// @UseGuards(AuthGuard)
export class AuthController {
  // usersService: UsersService;
  constructor(
    // private readonly usersQueryRepository: UsersQueryRepository,
    // private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
  ) {
    // this.usersService = usersService;
  }

  // @Get()
  // @HttpCode(200)
  // async getAllUsers(
  //   @Query() reqQuery: QueryUserInputModel,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const basicSortData = basicSortQuery(reqQuery);
  //   const sortData = {
  //     ...basicSortData,
  //     searchEmailTerm: reqQuery.searchEmailTerm ?? null,
  //     searchLoginTerm: reqQuery.searchLoginTerm ?? null,
  //   };
  //   const users = await this.usersRepository.getAll(sortData);
  //   if (users === null) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   return users;
  // }

  // @Post()
  // @HttpCode(201)
  // async createUser(
  //   // @Body() reqBody: RequestInputUserType,
  //   @Body() createModel: UserCreateModel,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const { login, password, email } = createModel;
  //   const InputUserModel = {
  //     login: login,
  //     password: password,
  //     email: email,
  //   };
  //   const createdUser = await this.usersService.create(InputUserModel);
  //   if (!createdUser) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   return createdUser;
  // }

  @Post('/login2')
  @UseGuards(LocalAuthGuard)
  async signinUser2(
    // @Param('id') userId: string,
    @Body() reqBody: AuthUserInputModel,
    // @Res({ passthrough: true }) res: Response,
  ) {
    const { password, loginOrEmail } = reqBody;
    const userAgent = 'unknown';
    const userIp = 'unknown';

    // return "hello";
    const isValid = await this.authService.signinUser(
      reqBody,
      userAgent,
      userIp,
    );
    return isValid;
  }

  @Post('/login')
  async signinUser(
    // @Param('id') userId: string,
    @Body() reqBody: AuthUserInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { password, loginOrEmail } = reqBody;
    const userAgent = 'unknown';
    const userIp = 'unknown';
    if (!password || !loginOrEmail) {
      res.sendStatus(400);
      return;
    }
    const authData = { loginOrEmail: loginOrEmail, password: password };
    const result = await this.authService.signinUser(
      authData,
      userAgent,
      userIp,
    );
    const accessToken = result.newAT;
    const refreshToken = result.newRT;
    return res
      .cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({ accessToken });

    //   if (result.data && result.status === ResultCode.Success) {
    //     const accessToken = result.data.newAT;
    //     const refreshToken = result.data.newRT;
    //     return res
    //       .cookie("refreshToken", refreshToken, {
    //         httpOnly: true,
    //         secure: true,
    //       })
    //       .status(200)
    //       .send({ accessToken });
    //   } else {
    //     sendCustomError(res, result);
    //     return;
    //   }
    // }
  }

  // @Get()
  // async hello(
  //   // Для работы с query применяя наш кастомный pipe
  //   @Query('id', NumberPipe) id: number,
  //   // Для работы с request (импорт Request из express)
  //   @Req() req: Request,
  //   // Для работы с response (импорт Response из express)
  //   // При работе с данным декоратором необходимо установить passthrough: true
  //   // чтобы работал механизм возврата ответа с помощью return data; или res.json(data)
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   return 'Hello';
  // }

  // @Post()
  // @HttpCode(200)
  // async create(
  //   @Body() createModel: UserCreateModel,
  //   @Res({ passthrough: true }) res: Response,
  // ): Promise<UserOutputModel> {
  //   const { login, password, email } = req.body;
  //   const InputUserModel = {
  //     login: login,
  //     password: password,
  //     email: email,
  //   };
  //   const createdUser = await userServices.create(InputUserModel);
  //   if (!createdUser) {
  //     res.sendStatus(400);
  //     return;
  //   }
  //   const transformdedUser = {
  //     id: createdUser.id,
  //     login: createdUser.login,
  //     email: createdUser.email,
  //     createdAt: createdUser.createdAt,
  //   };
  //   res.status(201).send(transformdedUser);
  // }

  // :id в декораторе говорит nest о том что это параметр
  // Можно прочитать с помощью @Param("id") и передать в property такое же название параметра
  // Если property не указать, то вернется объект @Param()
  // @Delete(':id')
  // // Установка guard на данный роут
  // @UseGuards(AuthGuard)
  // // Pipes из коробки https://docs.nestjs.com/pipes#built-in-pipes
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return id;
  // }

  // @Post()
  // // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  // @HttpCode(200)
  // async create(@Body() createModel: UserCreateModel): Promise<UserOutputModel> {
  //   const result = await this.usersService.create(
  //     createModel.email,
  //     createModel.name,
  //   );

  //   return await this.usersQueryRepository.getById(result);
  // }

  // // :id в декораторе говорит nest о том что это параметр
  // // Можно прочитать с помощью @Param("id") и передать в property такое же название параметра
  // // Если property не указать, то вернется объект @Param()
  // @Delete(':id')
  // // Установка guard на данный роут
  // @UseGuards(AuthGuard)
  // // Pipes из коробки https://docs.nestjs.com/pipes#built-in-pipes
  // async delete(@Param('id', ParseIntPipe) id: number) {
  //   return id;
  // }
}
