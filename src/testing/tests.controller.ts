// @ ---- АЛЬТЕРНАТИВЕЫЙ ПРОТЕЙШИЙ ВАРИАНТ ЧЕРЕЗ МОНГУС МОДЕЛЬ ----
// import { Controller, Delete, HttpCode } from '@nestjs/common';
// import { InjectModel } from '@nestjs/mongoose';
// import { Model } from 'mongoose';
// import { Blog } from 'src/blogs/blogs.schema';

// @Controller('testing')
// export class TestController {
//   constructor(@InjectModel(Blog.name) private blogModel: Model<Blog>) {}
//   @Delete('/all-data')
//   @HttpCode(204)
//   deleteAllData(): any {
//     this.blogModel.deleteMany({});
//   }
// }
// @ ------------------------------------------------------------------

import { Controller, Delete, HttpCode } from '@nestjs/common';
import { BlogRepository } from 'src/features/blogs/infrastructure/blogs.repository';
import { CommentLikesRepository } from 'src/features/commentLikes/infrastructure/commentLikes.repo';
// import { DevicesRepository } from 'src/features/devices/infrastructure/devices.repository';
import { PostRepository } from 'src/features/posts/infrastructure/post.repository';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';

@Controller('testing')
export class TestController {
  constructor(
    private blogRepository: BlogRepository,
    private postRepository: PostRepository,
    private usersRepository: UsersRepository,
    private commentLikesRepository: CommentLikesRepository,
    // private devicesRepository: DevicesRepository,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.blogRepository.deleteAll();
    await this.postRepository.deleteAll();
    await this.usersRepository.deleteAll();
    // await this.devicesRepository.deleteAll();
    await this.commentLikesRepository.deleteAll();
  }
}
