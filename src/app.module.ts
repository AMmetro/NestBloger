import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net/BlogDB',
    ),
    UsersModule, 
  ], 
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule {}
