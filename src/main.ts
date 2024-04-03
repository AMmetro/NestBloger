import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './settings/appConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(5000 || 5000, () =>
    console.log(`app started on port ${5000}`),
  );
  // await app.listen(appConfig.PORT || 5000, () =>
  //   console.log(`app started on port ${appConfig.PORT}`),
  // );
}
bootstrap();
