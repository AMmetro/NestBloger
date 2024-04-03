import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
// import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogMongoose, BlogSchema } from 'src/blogs/blogs.schema';
import { BlogsController } from 'src/blogs/blog.controller';
import { BlogsService } from 'src/blogs/blogs.service';
import { PostsService } from 'src/post/posts.service';
import { PostRepository } from 'src/post/posts.repo';
import { Post, PostSchema } from 'src/post/posts.schema';
import { BlogRepository } from 'src/blogs/blog.repo';
import {
  PostLikeMoongoose,
  PostLikeSchema,
} from 'src/postLikes/postsLikes.schema';
import { PostLikesServices } from 'src/postLikes/postLikes.service';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import {
  UserMongoose,
  UserSchema,
} from 'src/features/users/domain/user.entity';
import { UsersController } from 'src/features/users/api/users.controller';
import { PostsController } from 'src/post/posts.controller';
import { UsersService } from 'src/features/application/users.service';


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogMongoose.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLikeMoongoose.name, schema: PostLikeSchema },
      { name: UserMongoose.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    TestController,
    BlogsController,
    PostsController,
    UsersController,
  ],
  providers: [
    BlogsService,
    PostsService,
    PostRepository,
    BlogRepository,
    PostLikesRepository,
    PostLikesServices,
    UsersRepository,
    UsersService,
  ],
})
export class TestsModule {}
