// import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UnauthorizedException,
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
import { UsersService } from 'src/features/users/application/users.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { DevicesRepository } from '../infrastructure/devices.repository';
import { CookiesJwtAuthGuard } from 'src/base/utils/jwtService';
import { DevicesServices } from '../application/devices.service';

// Tag для swagger
// @ApiTags('Users')
@Controller('security')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
export class DevicesController {
  // usersService: UsersService;
  constructor(
    // private readonly usersQueryRepository: UsersQueryRepository,
    private readonly usersRepository: UsersRepository,
    private readonly usersService: UsersService,
    private readonly devicesRepository: DevicesRepository,
    private readonly devicesServices: DevicesServices,
  ) {
    // this.usersService = usersService;
  }

  @Get('devices')
  @HttpCode(200)
  @UseGuards(CookiesJwtAuthGuard)
  async getAllDevices(
    @Query() reqQuery: QueryUserInputModel,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    if (!userId) {
      throw new UnauthorizedException();
    }

    const devices = await this.devicesRepository.getAll(userId);
    if (devices === null) {
      res.sendStatus(404);
      return;
    }
    return devices;
  }

  @Post()
  @HttpCode(201)
  async createUser(
    // @Body() reqBody: RequestInputUserType,
    @Body() createModel: UserCreateModel,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { login, password, email } = createModel;
    const InputUserModel = {
      login: login,
      password: password,
      email: email,
    };
    const createdUser = await this.usersService.create(InputUserModel);
    if (!createdUser) {
      res.sendStatus(404);
      return;
      // throw new BadRequestException([
      //   { message: 'Cant`t create user', field: 'user' },
      // ]);
    }
    return createdUser;
  }

  // @Delete('devices')
  // @HttpCode(204)
  // async getAllDevices2(
  //   @Query() reqQuery: QueryUserInputModel,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   // const basicSortData = basicSortQuery(reqQuery);
  //   // const sortData = {
  //   //   ...basicSortData,
  //   //   searchEmailTerm: reqQuery.searchEmailTerm ?? null,
  //   //   searchLoginTerm: reqQuery.searchLoginTerm ?? null,
  //   // };
  //   const devices = await this.devicesRepository.getAll();
  //   if (devices === null) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   return devices;
  // }

  // НЕ ПРОПУСКАЕТ КОНТРОЛЫ НИЖЕ СЕБЯ!!!!!!!!!!!!!!!!!!!!
  // должно быть со слэшом айди  ????
  // @Delete(':id')
  // async deleteUserById(
  //   @Param('id') userId: string,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   if (!ObjectId.isValid(userId)) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   const isUser = await this.usersRepository.getById(userId);
  //   if (!isUser) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   const isDeleted = await this.usersRepository.deleteUserById(userId);
  //   if (isDeleted === null) {
  //     res.sendStatus(404);
  //     return;
  //   }
  //   res.sendStatus(204);
  //   return;
  // }

  @Delete('/devices')
  @HttpCode(204)
  @UseGuards(CookiesJwtAuthGuard)
  async deleteAllOtherDevices(
    // @Param('id') userId: string,
    @Res() res: Response,
    @Req() req: any,
  ) {
    // return res.sendStatus(202);
    const userId = req.user?.userId;
    const deviceId = req.user?.deviceId;
    if (!userId || !deviceId) {
      throw new UnauthorizedException();
    }
    const result = await this.devicesServices.deleteAllOtherDevices(
      userId,
      deviceId,
    );
    return res.sendStatus(204);
  }

  @Delete('devices/:id')
  @HttpCode(204)
  @UseGuards(CookiesJwtAuthGuard)
  async deleteDevice(
    @Param('id') deviceId: string,
    @Res({ passthrough: true }) res: Response,
    @Req() req: any,
  ) {
    const userId = req.user?.userId;
    if (!deviceId) {
      throw UnauthorizedException; 
    }
    const device = await this.devicesRepository.getById(deviceId);
    if (!device) {
      throw new NotFoundException();
    }

    const result = await this.devicesServices.deleteDeviceById(
      deviceId,
      userId,
    );
    if (!result) {
      throw new ForbiddenException();
    }

    return res.sendStatus(204);
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
