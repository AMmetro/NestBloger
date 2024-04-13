import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { UsersModule } from './users/users.module';
import { TestsModule } from './testing/tests.module';
import { ConfigModule } from '@nestjs/config';
import { BlogMongoose, BlogSchema } from './blogs/blogs.schema';
import { Post, PostSchema } from './post/posts.schema';
import { BlogsService } from './blogs/blogs.service';
import { PostsService } from './post/posts.service';
import { BlogsController } from './blogs/blog.controller';
import { PostRepository } from './post/posts.repo';
import { TestController } from './testing/tests.controller';
import { BlogRepository } from './blogs/blog.repo';
import { PostsController } from './post/posts.controller';
import {
  PostLikeMoongoose,
  PostLikeSchema,
} from './postLikes/postsLikes.schema';
import { PostLikesServices } from './postLikes/postLikes.service';
// import { appConfig } from './settings/appConfig';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { PostLikesRepository } from './features/postLikes/infrastructure/postLikes.repo';
import { UserMongoose, UserSchema } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
// import { UsersService } from './features/application/users.service';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { appSettings } from './settings/app-settings';
import { AuthMiddleware } from './common/middlewares/auth/basicAuth-middleware';
import { AuthController } from './features/auth/api/auth.controller';
import { UsersService } from './features/users/application/users.service';
import { AuthService } from './features/auth/application/auth.service';
import { DevicesServices } from './features/devices/application/devices.service';
import { JwtService } from '@nestjs/jwt';
import {
  DevicesMongoose,
  DevicesSchema,
} from './features/devices/domain/devices.entity';
import { DevicesRepository } from './features/devices/infrastructure/devices.repository';
import { AuthModule } from './features/auth/domain/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: ['.env'] }), // определяет приорететност .env файлов из массива для загрузки
    // MongooseModule.forRoot(appConfig.mongoURI),
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_TESTING
        : appSettings.api.MONGO_CONNECTION_URI,
    ),
    // MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    // MongooseModule.forRoot(
    //   'mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net/?retryWrites=true&w=majority',
    // ),
    MongooseModule.forFeature([
      { name: BlogMongoose.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLikeMoongoose.name, schema: PostLikeSchema },
      { name: UserMongoose.name, schema: UserSchema },
      { name: DevicesMongoose.name, schema: DevicesSchema },
    ]),
    // UsersModule,
    TestsModule,
    AuthModule,
  ],
  controllers: [
    AppController,
    BlogsController,
    TestController,
    PostsController,
    UsersController,
    AuthController,
  ],
  providers: [
    AppService,
    BlogsService,
    PostsService,
    PostRepository,
    BlogRepository,
    PostLikesRepository,
    PostLikesServices,
    UsersRepository,
    UsersService,
    AuthService,
    DevicesServices,
    DevicesRepository,
    JwtService,
  ],
})

// export class AppModule {}

// export class AppModule implements NestModule {
//   // https://docs.nestjs.com/middleware#applying-middleware
//   configure(consumer: MiddlewareConsumer) {
//     consumer.apply(LoggerMiddleware).forRoutes('/users');
//     // .apply(OtherMiddleware).forRoutes('*');
//     // .apply(MailMiddleware).forRoutes('*');
//   }
// }
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/users/:id', method: RequestMethod.DELETE },
        { path: '/users', method: RequestMethod.POST },
      );
  }
}
