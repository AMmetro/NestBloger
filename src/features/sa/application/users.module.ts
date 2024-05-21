import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserSQL } from '../domain/userSQL.entity';
import { SaService } from './sa.service';
import { SaUsersController } from '../api/sausers.controller';

@Module({
//   imports: [TypeOrmModule.forFeature([UserSQL])],
  providers: [SaService],
  controllers: [SaUsersController],
})
export class UsersSQLModule {}
