// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserSQL } from '../domain/user.entity';
// import { SaController } from '../api/sa.controller';
// import { SaService } from './sa.service';

// @Module({
//   // imports: [TypeOrmModule.forFeature([UserSQL])],
//   imports: [],
//   providers: [SaService],
//   controllers: [SaController],
// })
// export class UsersModule {}


import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserSQL } from '../domain/userSQL.entity';
import { SaService } from './sa.service';
import { SaController } from '../api/sa.controller';

@Module({
//   imports: [TypeOrmModule.forFeature([UserSQL])],
  providers: [SaService],
  controllers: [SaController],
})
export class UsersSQLModule {}
