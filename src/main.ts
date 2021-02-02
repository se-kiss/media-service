import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import {
  MicroserviceOptions,
  RpcException,
  Transport,
} from '@nestjs/microservices';
import { AppModule } from './app.module';
import { status } from 'grpc';

async function bootstrap() {
  const logger = new Logger('MediaService');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        url: '0.0.0.5000',
        package: [],
        protoPath: [],
      },
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: errors =>
        new RpcException({
          code: status.INVALID_ARGUMENT,
          message: errors.toString(),
        }),
    }),
  );

  app.listen(() => logger.log('Media service is listening'));
}
bootstrap();
