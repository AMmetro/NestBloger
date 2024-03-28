import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { Post, PostSchema } from './posts.schema';
// import { PostsController } from './posts.controller';
// import { PostsService } from './posts.service';
// import { Blog, BlogSchema } from 'src/blogs/blogs.schema';
// import { PostRepository } from './posts.repo';

@Module({
  imports: [
    // MongooseModule.forFeature([
    //   { name: Post.name, schema: PostSchema },
    //   { name: Blog.name, schema: BlogSchema },
    // ]),
  ],
  // controllers: [PostsController],
  // providers: [PostsService, PostRepository],
})
export class PostsModule {}
