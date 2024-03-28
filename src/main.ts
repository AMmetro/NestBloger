import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './appConfig';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.listen(appConfig.PORT || 5000, () =>
    console.log(`app started on port ${appConfig.PORT}`),
  );
}
bootstrap();
