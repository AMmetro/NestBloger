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
import { BlogsService } from 'src/blogs/blogs.service';
import { PostRepository } from 'src/features/posts/infrastructure/post.repository';
import { UsersRepository } from 'src/features/users/infrastructure/users.repository';

@Controller('testing')
export class TestController {
  constructor(
    private readonly blogsService: BlogsService,
    private postRepository: PostRepository,
    private usersRepository: UsersRepository,
  ) {}
  @Delete('/all-data')
  @HttpCode(204)
  async deleteAllData() {
    await this.blogsService.deleteAll();
    await this.postRepository.deleteAll();
    await this.usersRepository.deleteAll();
  }
}
