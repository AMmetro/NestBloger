import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlogMongoose, BlogSchema } from 'src/blogs/blogs.schema';
import { BlogsController } from 'src/blogs/blog.controller';
import { BlogsService } from 'src/blogs/blogs.service';
// import { PostsService } from 'src/post/posts.service';
// import { PostRepository } from 'src/post/posts.repo';
// import { Post, PostSchema } from 'src/post/posts.schema';
import { BlogRepository } from 'src/blogs/blog.repo';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';
import { PostLikesRepository } from 'src/features/postLikes/infrastructure/postLikes.repo';
import {
  UserMongoose,
  UserSchema,
} from 'src/features/users/domain/user.entity';
import { UsersController } from 'src/features/users/api/users.controller';
// import { PostsController } from 'src/post/posts.controller';
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
// import { JwtStrategy } from 'src/features/auth/strategies/jwtStrategy';
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

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogMongoose.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLikeMoongoose.name, schema: PostLikeSchema },
      { name: UserMongoose.name, schema: UserSchema },
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
    // JwtStrategy,
    AuthService,
    JwtService,
    PostCommentsRepository,
    PostCommentsService,
    CommentLikesRepository,
    CommentLikesServices,
    // AuthJwtService,
  ],
})
export class TestsModule {}
