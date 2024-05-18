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
import {
  QueryUserInputModel,
  UserCreateModel,
} from './dto/input/create-user.input.model';
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
  ) {}

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
    const createdUser = await this.usersService.createNewUser(InputUserModel);
    if (!createdUser) {
      res.sendStatus(404);
      return;
      // throw new BadRequestException([
      //   { message: 'Cant`t create user', field: 'user' },
      // ]);
    }
    return createdUser;
  }

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
}
