import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { appConfig } from './settings/appConfig';
import { appSettings } from './settings/app-settings';
import { applyAppSettings } from './settings/apply-app-setting';
import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';


 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.use(cookieParser());

  app.enableCors();
  await app.listen(appSettings.api.APP_PORT, () =>
    console.log(`app started on port ${appSettings.api.APP_PORT}`),
  );
  // await app.listen(appConfig.PORT || 5000, () =>
  //   console.log(`app started on port ${appConfig.PORT}`),
  // );
}
bootstrap();
