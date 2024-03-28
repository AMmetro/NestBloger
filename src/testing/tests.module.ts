import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
// import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/blogs/blogs.schema';
import { BlogsController } from 'src/blogs/blog.controller';
import { BlogsService } from 'src/blogs/blogs.service';
// import { User, UserSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Blog.name, schema: BlogSchema }]),
  ],
  controllers: [TestController, BlogsController],
  providers: [BlogsService],
})
export class TestsModule {}
