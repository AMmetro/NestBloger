import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { TestsModule } from './testing/tests.module';
import { ConfigModule } from '@nestjs/config';
import { appConfig } from './appConfig';
import { Blog, BlogSchema } from './blogs/blogs.schema';
import { Post, PostSchema } from './post/posts.schema';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './post/posts.service';
import { BlogsController } from './blogs/blog.controller';
import { PostRepository } from './post/posts.repo';
import { TestController } from './testing/tests.controller';
import { BlogRepository } from './blogs/blog.repo';
import { PostsController } from './post/posts.controller';
import { PostLikesRepository } from './postLikes/postLikes.repo';
import { PostLike, PostLikeSchema } from './postLikes/postsLikes.schema';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }), // определяет приорететност .env файлов из массива для загрузки
    MongooseModule.forRoot(appConfig.mongoURI),
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLike.name, schema: PostLikeSchema },
    ]),
    UsersModule,
    TestsModule,
  ],
  controllers: [
    AppController,
    BlogsController,
    TestController,
    PostsController,
  ],
  providers: [
    AppService,
    BlogsService,
    PostsService,
    PostRepository,
    BlogRepository,
    PostLikesRepository,
  ],
})
export class AppModule {}
