import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
// import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';

// import { AuthGuard } from './auth.guard';
// import { AuthService } from './auth.service';
// import { jwtConstants } from './constants';
import { AuthController } from '../api/auth.controller';
import { AuthService } from '../application/auth.service';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { UsersService } from 'src/features/users/application/users.service';
import { DevicesServices } from 'src/features/devices/application/devices.service';
import { JwtService } from '@nestjs/jwt';
import {
  UserMongoose,
  UserSchema,
} from 'src/features/users/domain/user.entity';
import {
  DevicesMongoose,
  DevicesSchema,
} from 'src/features/devices/domain/devices.entity';
import { DevicesRepository } from 'src/features/devices/infrastructure/devices.repository';
import { LocalStrategy } from '../strategies/localStrategy';
import { BasicStrategy } from '../strategies/basicStrategy';

@Module({
  imports: [
    // UsersModule,
    JwtModule.register({
      global: true,
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60s' },
    }),
    // JwtModule.registerAsync({
    //   useFactory: () => {
    //     return {
    //       secret: 'jwtConstants.secret',
    //       signOptions: { expiresIn: '60s' },
    //     };
    //   },
    //   // inject: [ConfigService],
    // }),

    MongooseModule.forFeature([
      { name: UserMongoose.name, schema: UserSchema },
      { name: DevicesMongoose.name, schema: DevicesSchema },
    ]),
  ],
  providers: [
    AuthService,
    UsersRepository,
    UsersService,
    DevicesServices,
    JwtService,
    DevicesRepository,
    LocalStrategy,
    BasicStrategy,
    // вешает guard на весь контроллер (независмо от того что он не прописан в самом контроллере)
    // {
    //   provide: APP_GUARD,
    //   useClass: AuthGuard,
    // },
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
