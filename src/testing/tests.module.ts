import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
// import { UsersService } from './users.service';
// import { MongooseModule } from '@nestjs/mongoose';
// import { User, UserSchema } from './users.schema';

@Module({
  // imports: [
  //   MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  // ],
  controllers: [TestController],
  // providers: [TestController],

})
export class TestsModule {}

