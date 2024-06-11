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
  BadRequestException,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';

import { Request } from 'express';

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
import {
  AuthUserInputModel,
  RegistrationUserInputModel,
} from './dto/input/auth.input.model';
import { UsersService } from 'src/features/users/application/users.service';
import { AuthService } from '../application/auth.service';
import { LocalAuthGuard } from 'src/common/guards/local.guard';
import { JwtAuthGuard } from 'src/common/guards/jwt.guard';
import { BasicAuthGuard } from 'src/common/guards/basic.guard';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { CookiesJwtAuthGuard } from 'src/base/utils/jwtService';

// Tag для swagger
// @ApiTags('Users')
@Controller('auth')
// Установка guard на весь контроллер
// @UseGuards(OptioanlAuthGuard)
export class AuthController {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Get('/superAdmin')
  @UseGuards(BasicAuthGuard)
  async forSuperAdmin(
    // @Param('id') userId: string,
    @Body() input: { password: string; loginOrEmail: string },
    // @Res({ passthrough: true }) res: Response,
  ) {
    const { loginOrEmail } = input;
    const { password } = input;
    // generate coocies
    return 'i am admin';
  }

  @Post('/refresh-token')
  @UseGuards(CookiesJwtAuthGuard)
  async generateNewAccesAndRefresh(
    @Req() request: any,
    @Res({ passthrough: true }) res: Response,
  ) {

    console.log("------------request--------------");
    console.log(request);

    const userId = request.user?.userId;
    const deviceId = request.user?.deviceId;
    if (!userId || !deviceId) {
      throw UnauthorizedException;
    }
    const newAccessAndRefreshPair = await this.authService.refreshToken(
      userId,
      deviceId,
    );
    if (!newAccessAndRefreshPair) {
      throw NotFoundException;
    }
    res
      .cookie('refreshToken', newAccessAndRefreshPair.RefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({ accessToken: newAccessAndRefreshPair.AccessToken });
    return;
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async aboutMe(@Req() req: any, @Res({ passthrough: true }) res: Response) {
    const userId = req.user.userId;
    const me = await this.authService.getUserById(userId);
    if (!me) {
      res.sendStatus(401);
      return;
    }
    const meModel = { userId: me.id, login: me.login, email: me.email };
    res.status(200).send(meModel);
  }

  @Post('/logout')
  @HttpCode(204)
  @UseGuards(CookiesJwtAuthGuard)
  async logoutUser(@Res() res: Response, @Req() req: any) {
    const userId = req.user?.userId;
    const deviceId = req.user?.deviceId;
    if (!userId || !deviceId) {
      throw NotFoundException;
    }
    const deviceIsDeleted = await this.authService.logout(userId, deviceId);

    if (!deviceIsDeleted) {
      throw NotFoundException;
    }
    return res.clearCookie('refreshToken').sendStatus(204);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  async loginUser(
    // @Param('id') userId: string,
    @Body() reqBody: AuthUserInputModel,
    @Res() res: Response,
    @Req() req: any,
  ) {
    const { password, loginOrEmail } = reqBody;
    if (!password || !loginOrEmail) {
      res.sendStatus(400);
      return;
    }
    const authData = { loginOrEmail: loginOrEmail, password: password };
    const userAgent = (res.locals.ua = req.get('User-Agent') || 'unknown');
    const userIp = req.ip || 'unknown';
    const tokens = await this.authService.loginUser(
      authData,
      userAgent,
      userIp,
    );
    if (!tokens) {
      throw new UnauthorizedException([
        { message: 'not found user', field: 'user' },
      ]);
    }
    return res
      .cookie('refreshToken', tokens.RefreshToken, {
        httpOnly: true,
        secure: true,
      })
      .status(200)
      .send({
        accessToken: tokens.AccessToken,
      });
  }

  @Post('/registration')
  @HttpCode(204)
  async registration(
    // @Param('id') userId: string,
    @Body() reqBody: RegistrationUserInputModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { password, login, email } = reqBody;
    if (!password || !login || !email) {
      res.sendStatus(401);
      return;
    }
    const notConfirmedUser = { password, login, email, isConfirmed: false };
    const result =
      await this.authService.registrationUserWithConfirmation(notConfirmedUser);
    // if (result.status === 400) {
    //   throw new BadRequestException([
    //     { message: 'email allready exist', field: 'email' }, 
    //   ]);
    // }
    if (!result) {
      throw new BadRequestException();
    }
    // res.sendStatus(204);
  }

  @Post('/registration-email-resending')
  @HttpCode(204)
  async registrationEmailResending(
    @Body() reqBody: { email: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { email } = reqBody;
    if (!email) {
      res.sendStatus(401);
      return;
    }
    const isResended = await this.authService.emailResending(email);
  }

  @Post('/registration-confirmation')
  @HttpCode(204)
  async registrationConfirmation(
    @Body() reqBody: { code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const { code } = reqBody;
    if (!code) {
      res.sendStatus(401);
      return;
    }
    const isConfirmed = await this.authService.confirmEmail(code);
    if (!isConfirmed) {
      throw new BadRequestException();
    }
    res.sendStatus(204);
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
