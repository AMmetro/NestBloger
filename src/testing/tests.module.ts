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
import { PostLikesRepository } from 'src/postLikes/postLikes.repo';
import {
  PostLikeMoongoose,
  PostLikeSchema,
} from 'src/postLikes/postsLikes.schema';
import { PostsController } from 'src/post/posts.controller';
import { PostLikesServices } from 'src/postLikes/postLikes.service';
// import { User, UserSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BlogMongoose.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLikeMoongoose.name, schema: PostLikeSchema },
    ]),
  ],
  controllers: [TestController, BlogsController, PostsController],
  providers: [
    BlogsService,
    PostsService,
    PostRepository,
    BlogRepository,
    PostLikesRepository,
    PostLikesServices,
  ],
})
export class TestsModule {}
