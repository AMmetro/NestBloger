import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import {
  UserMongoose,
  UserSchema,
} from 'src/features/users/domain/user.entity';
import { UsersController } from 'src/features/users/api/users.controller';
import { UsersService } from 'src/features/users/application/users.service';
import { DevicesServices } from 'src/features/devices/application/devices.service';
import {
  DevicesMongoose,
  DevicesSchema,
} from 'src/features/devices/domain/devices.entity';
import { DevicesRepository } from 'src/features/devices/infrastructure/devices.repository';
import { DevicesController } from 'src/features/devices/api/devices.controller';
import { PostsController } from 'src/features/posts/api/posts.controller';
import { Post, PostSchema } from 'src/features/posts/domain/post.entity';
import { PostsService } from 'src/features/posts/application/post.service';
import { PostRepository } from 'src/features/posts/infrastructure/post.repository';
import {
  PostLikeMoongoose,
  PostLikeSchema,
} from 'src/features/postLikes/domain/postsLikes.schema';
import { PostLikesServices } from 'src/features/postLikes/application/postLikes.service';
import { AuthService } from 'src/features/auth/application/auth.service';
import { PostCommentsRepository } from 'src/features/postComments/infrastructure/postComments.repo';
import {
  PostCommentMoongoose,
  PostCommentSchema,
} from 'src/features/postComments/domain/postsComment.schema';
import { PostCommentsService } from 'src/features/postComments/application/postComments.service';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';
import {
  CommentLikeMoongoose,
  CommentLikeSchema,
} from 'src/features/commentLikes/domain/commentLikes.schema';
import { CommentLikesServices } from 'src/features/commentLikes/application/commentLikes.service';
import { SaUsersController } from 'src/features/sa/api/sausers.controller';
import { SaService } from 'src/features/sa/application/sa.service';
import { BlogRepository } from 'src/features/blogs/infrastructure/blogs.repository';
import { BlogsController } from 'src/features/blogs/api/blogs.controller';
import { BlogsService } from 'src/features/blogs/application/blogs.service';
// import { BlogsController } from 'src/features/blogs/api/blogs.controller';
// import { BlogMongoose, BlogSchema } from 'src/2blogs/blogs.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: BlogMongoose.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLikeMoongoose.name, schema: PostLikeSchema },
      // { name: UserMongoose.name, schema: UserSchema },
      { name: DevicesMongoose.name, schema: DevicesSchema },
      { name: PostCommentMoongoose.name, schema: PostCommentSchema },
      { name: CommentLikeMoongoose.name, schema: CommentLikeSchema },
    ]),
  ],
  controllers: [
    TestController,
    BlogsController,
    PostsController,
    UsersController,
    DevicesController,
    SaUsersController,
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
    DevicesServices,
    DevicesRepository,
    AuthService,
    JwtService,
    PostCommentsRepository,
    PostCommentsService,
    CommentLikesRepository,
    CommentLikesServices,
    SaService,
  ],
  // exports: [SaService],
})
export class TestsModule {}
