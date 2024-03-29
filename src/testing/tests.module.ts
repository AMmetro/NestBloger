import { Module } from '@nestjs/common';
import { TestController } from './tests.controller';
// import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Blog, BlogSchema } from 'src/blogs/blogs.schema';
import { BlogsController } from 'src/blogs/blog.controller';
import { BlogsService } from 'src/blogs/blogs.service';
import { PostsService } from 'src/post/posts.service';
import { PostRepository } from 'src/post/posts.repo';
import { Post } from 'src/post/posts.schema';
import { BlogRepository } from 'src/blogs/blog.repo';
import { PostLikesRepository } from 'src/postLikes/postLikes.repo';
import { PostLike } from 'src/postLikes/postsLikes.schema';
// import { User, UserSchema } from './users.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: Post },
      { name: PostLike.name, schema: PostLike },
    ]),
  ],
  controllers: [TestController, BlogsController],
  providers: [
    BlogsService,
    PostsService,
    PostRepository,
    BlogRepository,
    PostLikesRepository,
  ],
})
export class TestsModule {}
