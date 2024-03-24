import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

const tempConfig = { port: 5000 };

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(tempConfig.port || 5000, () =>
    console.log(`app started on port ${tempConfig.port}`),
  );
}
bootstrap();
``