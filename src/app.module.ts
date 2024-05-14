import { ConfigModule, ConfigService } from '@nestjs/config';
// @@
// @ так чтобы (построение зависимостей дерева графов) process.env при старте происходил в первую очередь
// @ const configModule = ConfigModule.forRoot
// @ https://www.youtube.com/watch?v=jdxFuG2pH2g
// @@
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { TestsModule } from './testing/tests.module';
import { BlogMongoose, BlogSchema } from './blogs/blogs.schema';
import { BlogsService } from './blogs/blogs.service';
import { BlogsController } from './blogs/blog.controller';
import { TestController } from './testing/tests.controller';
import { BlogRepository } from './blogs/blog.repo';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { PostLikesRepository } from './features/postLikes/infrastructure/postLikes.repo';
import { UserMongoose, UserSchema } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
import { appSettings } from './settings/app-settings';
import { AuthMiddleware } from './common/middlewares/auth/basicAuth-middleware';
import { AuthController } from './features/auth/api/auth.controller';
import { UsersService } from './features/users/application/users.service';
import { AuthService } from './features/auth/application/auth.service';
import { DevicesServices } from './features/devices/application/devices.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import {
  DevicesMongoose,
  DevicesSchema,
} from './features/devices/domain/devices.entity';
import { DevicesRepository } from './features/devices/infrastructure/devices.repository';
import { BasicStrategy } from './features/auth/strategies/basicStrategy';
import { LocalStrategy } from './features/auth/strategies/localStrategy';
import { RateLimitMiddleware } from './common/middlewares/rateLimit-middleware';
import { RateLimitRepository } from './features/rateLimit/infrastructure/rateLimit.repository';
import {
  RateLimitMongoose,
  RateLimitSchema,
} from './features/rateLimit/domain/rateLimit.entity';
import { Post, PostSchema } from './features/posts/domain/post.entity';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsService } from './features/posts/application/post.service';
import { PostRepository } from './features/posts/infrastructure/post.repository';
import {
  PostLikeMoongoose,
  PostLikeSchema,
} from './features/postLikes/domain/postsLikes.schema';
import { PostLikesServices } from './features/postLikes/application/postLikes.service';
import { JwtStrategy } from './features/auth/strategies/jwtStrategy';
import { PassportModule } from '@nestjs/passport';
import { CustomBlogIdvalidation } from './common/decorators/validate/isBlogExist';
import { PostCommentsRepository } from './features/postComments/infrastructure/postComments.repo';
import {
  PostCommentMoongoose,
  PostCommentSchema,
} from './features/postComments/domain/postsComment.schema';
import { PostCommentsController } from './features/postComments/api/postComments.controller';
import { PostCommentsService } from './features/postComments/application/postComments.service';
import { CommentLikesServices } from './features/commentLikes/application/commentLikes.service';
import { CommentLikesRepository } from './features/commentLikes/infrastructure/commentLikes.repo';
import {
  CommentLikeMoongoose,
  CommentLikeSchema,
} from './features/commentLikes/domain/commentLikes.schema';
import DatabaseModule from './database/postgress/database.module';
import { SaController } from './features/sa/api/sa.controller';
// import { SaService } from './features/sa/application/sa.service';
// import UsersSQLRepository from './features/sa/infrastructure/users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserSQL } from './features/sa/domain/userSQL.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
    }), // определяет приорететност .env файлов из массива для загрузки
    // MongooseModule.forRoot(
    //   appSettings.env.isTesting()
    //     ? appSettings.api.MONGO_CONNECTION_URI_TESTING
    //     : appSettings.api.MONGO_CONNECTION_URI,
    // ),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({}),

    // TypeOrmModule.forRoot(), UsersModule

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'root',
      password: 'admin',
      // database: 'nestBloger',
      database: 'dymich',
      entities: [UserSQL],
      // для ROW должно быть false
      autoLoadEntities: false,
      // для ROW должно быть false
      synchronize: false,
    }),

    //** подключение к базе SQL напрямую без typeorm
    //* DatabaseModule.forRootAsync({
    //*   imports: [ConfigModule],
    //*   inject: [ConfigService],
    //*   useFactory: (configService: ConfigService) => ({
    //*     host: configService.get('POSTGRES_HOST'),
    //*     port: configService.get('POSTGRES_PORT'),
    //*     database: configService.get('POSTGRES_DB'),
    //*     user: 'admin',
    //*     password: '1111',
    //*   }),
    //* }),
    // **
    MongooseModule.forRoot(
      'mongodb+srv://metroexpress:suradet842@cluster0.gkpqpve.mongodb.net/?retryWrites=true&w=majority',
    ),
    MongooseModule.forFeature([
      { name: BlogMongoose.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: PostLikeMoongoose.name, schema: PostLikeSchema },
      { name: UserMongoose.name, schema: UserSchema },
      { name: DevicesMongoose.name, schema: DevicesSchema },
      { name: RateLimitMongoose.name, schema: RateLimitSchema },
      { name: PostCommentMoongoose.name, schema: PostCommentSchema },
      { name: CommentLikeMoongoose.name, schema: CommentLikeSchema },
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
    SaController,
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
    // SaService,
    // UsersSQLRepository,
    // AuthJwtService,
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
    consumer.apply(RateLimitMiddleware).forRoutes(
      { path: '/auth/login', method: RequestMethod.POST },
      { path: '/auth/registration', method: RequestMethod.POST },
      { path: '/auth/registration-confirmation', method: RequestMethod.POST },
      {
        path: '/auth/registration-email-resending',
        method: RequestMethod.POST,
      },
    );
  }
}
