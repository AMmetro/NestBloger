import {
  BadRequestException,
  INestApplication,
  ValidationPipe,
} from '@nestjs/common';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  ErrorExceptionFilter,
  HttpExceptionFilter,
} from '../common/exception-filters/http-exception-filter';
import { appSettings } from './app-settings';
import { LoggerMiddlewareFunc } from '../common/middlewares/logger.middleware';

// Префикс нашего приложения (http://site.com/api)
const APP_PREFIX = '/api';

// Используем данную функцию в main.ts и в e2e тестах
export const applyAppSettings = (app: INestApplication) => {
  // Применение глобальных Interceptors
  // app.useGlobalInterceptors()

  // Применение глобальных Guards
  //  app.useGlobalGuards(new AuthGuard());

  // Применить middleware глобально
  // app.use(LoggerMiddlewareFunc);

  // Установка префикса
  // setAppPrefix(app);

  // Конфигурация swagger документации
  // setSwagger(app);

  // Применение глобальных pipes
  setAppPipes(app);

  // Применение глобальных exceptions filters
  setAppExceptionsFilters(app);
};

const setAppPrefix = (app: INestApplication) => {
  // Устанавливается для разворачивания front-end и back-end на одном домене
  // https://site.com - front-end
  // https://site.com/api - backend-end
  app.setGlobalPrefix(APP_PREFIX);
};

const setSwagger = (app: INestApplication) => {
  if (!appSettings.env.isProduction()) {
    const swaggerPath = APP_PREFIX + '/swagger-doc';

    // const config = new DocumentBuilder()
    //   .setTitle('BLOGGER API')
    //   .addBearerAuth()
    //   .setVersion('1.0')
    //   .build();

    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup(swaggerPath, app, document, {
    //   customSiteTitle: 'Blogger Swagger',
    // });
  }
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      // Для работы трансформации входящих данных
      // например вместо преобразования в числа внутри не писать везде
      // (@Param('id', ParseIntPipe) userId: number))
      transform: true,
      // Выдавать первую ошибку для каждого поля
      stopAtFirstError: true,
      // Перехватываем ошибку, кастомизируем её и выкидываем 400 с собранными данными
      exceptionFactory: (errors) => {
        const customErrors = [];
        errors.forEach((e) => {
          const constraintKeys = Object.keys(e.constraints);

          constraintKeys.forEach((cKey) => {
            const msg = e.constraints[cKey];

            customErrors.push({ field: e.property, message: msg });
          });
        });

        // Error 400
        throw new BadRequestException(customErrors);
      },
    }),
  );
};

const setAppExceptionsFilters = (app: INestApplication) => {
  app.useGlobalFilters(new HttpExceptionFilter()
  //  , new ErrorExceptionFilter()
  );
};
