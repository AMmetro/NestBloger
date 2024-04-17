import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { appConfig } from './settings/appConfig';
import { appSettings } from './settings/app-settings';
import { applyAppSettings } from './settings/apply-app-setting';
 
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  applyAppSettings(app);
 
  app.enableCors();
  await app.listen(appSettings.api.APP_PORT, () =>
    console.log(`app started on port ${appSettings.api.APP_PORT}`),
  );
  // await app.listen(appConfig.PORT || 5000, () =>
  //   console.log(`app started on port ${appConfig.PORT}`),
  // );
}
bootstrap();
