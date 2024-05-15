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
