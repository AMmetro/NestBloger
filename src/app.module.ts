// @@
// @ так чтобы (построение зависимостей дерева графов) process.env при старте происходил в первую очередь
// @ const configModule = ConfigModule.forRoot
// @ https://www.youtube.com/watch?v=jdxFuG2pH2g
// @@
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Post,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose'; 
import { TestsModule } from './testing/tests.module';
import { TestController } from './testing/tests.controller';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { PostLikesRepository } from './features/postLikes/infrastructure/postLikes.repo';
import { Users } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
import { AuthMiddleware } from './common/middlewares/auth/basicAuth-middleware';
import { AuthController } from './features/auth/api/auth.controller';
import { UsersService } from './features/users/application/users.service';
import { AuthService } from './features/auth/application/auth.service';
import { DevicesServices } from './features/devices/application/devices.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
// import {
//   DevicesMongoose,
//   DevicesSchema,
// } from './features/devices/domain/devices.entity';
import { DevicesRepository } from './features/devices/infrastructure/devices.repository';
import { BasicStrategy } from './features/auth/strategies/basicStrategy';
import { LocalStrategy } from './features/auth/strategies/localStrategy';
import { RateLimitMiddleware } from './common/middlewares/rateLimit-middleware';
import { RateLimitRepository } from './features/rateLimit/infrastructure/rateLimit.repository';
import {
  RateLimitMongoose,
  RateLimitSchema,
} from './features/rateLimit/domain/rateLimit.entity';
// import { Post, PostSchema } from './features/posts/domain/post.entity';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/post.service';
import { PostRepository } from './features/posts/infrastructure/post.repository';
// import {
//   PostLike,
//   PostLikeMoongoose,
//   PostLikeSchema,
// } from './features/postLikes/domain/postsLikes.schema';
import { PostLikesServices } from './features/postLikes/application/postLikes.service';
import { JwtStrategy } from './features/auth/strategies/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { CustomBlogIdvalidation } from './common/decorators/validate/isBlogExist';
import { PostCommentsRepository } from './features/postComments/infrastructure/postComments.repo';
import {
  // PostCommentMoongoose,
  // PostCommentSchema,
  PostComments,
} from './features/postComments/domain/postsComment.schema';
import { PostCommentsController } from './features/postComments/api/postComments.controller';
import { PostCommentsService } from './features/postComments/application/postComments.service';
import { CommentLikesServices } from './features/commentLikes/application/commentLikes.service';
import { CommentLikesRepository } from './features/commentLikes/infrastructure/commentLikes.repo';
import {
  CommentLike,
  // CommentLikeMoongoose,
  // CommentLikeSchema,
} from './features/commentLikes/domain/commentLikes.schema';
import { SaUsersController } from './features/sa/api/sausers.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SaService } from './features/sa/application/sa.service';
import { SaBlogsController } from './features/sa/api/sablogs.controller';
import { BlogRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsService } from './features/blogs/application/blogs.service';
import { SaTablesController } from './features/sa/api/tables.controller';
import { SaRepository } from './features/sa/infrastructure/sa.repository';
import databaseConf, { type DatabaseConfig } from './database/pgConfig/db.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Devices } from './features/devices/domain/devices.entity';
import { Posts } from './features/posts/domain/post.entity';
import { PostLike } from './features/postLikes/domain/postsLikes.schema';
import { BlogEntity } from './features/blogs/domain/blog.entity';


@Module({
  imports: [
    ConfigModule.forRoot({
    // определяет приорететност .env файлов из массива для загрузки
      envFilePath: ['.env.local', '.env'],
      // ---- относиться к typeorm ---
      isGlobal: true,
      load: [databaseConf],
      // ----------------------------
    }), 
    TypeOrmModule.forRootAsync({
      useFactory(config: ConfigService<DatabaseConfig>) {
        return config.get('database', {
          infer: true,
        });
      },
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Users, Devices, Posts, PostComments, PostLike, PostComments, CommentLike, BlogEntity]),
 
    // MongooseModule.forRoot(
    //   appSettings.env.isTesting()
    //     ? appSettings.api.MONGO_CONNECTION_URI_TESTING
    //     : appSettings.api.MONGO_CONNECTION_URI,
    // ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),

    //--------- прямой вариант подключения typeorm из доки-------
    // TypeOrmModule.forRoot({
    //   type: 'postgres',
    //   host: 'localhost',
    //   port: 5432,
    //   username: 'postgres',
    //   password: '1111',
    //   // password: 'admin',
    //   database: 'nestBlogger',
    //   // database: 'nestBloger',
    //   // entities: [User],
    //   // для ROW SQL должно быть false
    //   autoLoadEntities: true,
    //   // иначе ипортировать entities вручную или через блок код:
    //   // entities: ['./**/*.entity{.ts,.js}', Posts... ]
    //   // для ROW SQL должно быть false
    //   // отвечает за автомиграции + создает таблицы автоматом 
    //   synchronize: true,
    // }),

    MongooseModule.forRoot( 
      'mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      // { name: PostLikeMoongoose.name, schema: PostLikeSchema },
      // { name: CommentLikeMoongoose.name, schema: CommentLikeSchema },
      { name: RateLimitMongoose.name, schema: RateLimitSchema },
      // { name: PostCommentMoongoose.name, schema: PostCommentSchema }, 
    ]),

    // UsersModule,
    TestsModule,
    // AuthModule,
  ],
  controllers: [
    AppController,
    BlogsController,
    TestController,
    PostsController,
    UsersController,
    AuthController,
    PostCommentsController,
    SaUsersController,
    SaBlogsController,
    SaTablesController,
  ],
  providers: [
    // {
    //   provide: PostRepository,
    //   useClass: appSettings.env.isTesting()
    //     ? PostRepository // MONGO
    //     : PostLikesRepository, // SQL
    // },
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
    RateLimitRepository,
    JwtService,
    LocalStrategy,
    BasicStrategy,
    JwtStrategy,
    CustomBlogIdvalidation,
    PostCommentsRepository,
    PostCommentsService,
    CommentLikesServices,
    CommentLikesRepository,
    SaService,
    SaRepository,
  ],
  // exports: [JwtModule];
})

// export class AppModule {}
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/users/:id', method: RequestMethod.DELETE },
        { path: '/users', method: RequestMethod.POST },
      );
    consumer
      .apply(AuthMiddleware)
      .forRoutes({ path: '/blogs/:id/posts', method: RequestMethod.POST });
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        { path: '/posts/:id', method: RequestMethod.PUT },
        { path: '/posts/:id', method: RequestMethod.DELETE },
        { path: '/posts', method: RequestMethod.POST },
      );
    // consumer.apply(RateLimitMiddleware).forRoutes(
    //   { path: '/auth/login', method: RequestMethod.POST },
    //   { path: '/auth/registration', method: RequestMethod.POST },
    //   { path: '/auth/registration-confirmation', method: RequestMethod.POST },
    //   {
    //     path: '/auth/registration-email-resending',
    //     method: RequestMethod.POST,
    //   },
    // );
  }
}
