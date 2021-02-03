import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MediaModule } from './media/media.module';
import { ElasticModule } from './elastic/elastic.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MediaModule,
    MongooseModule.forRoot(process.env.MONGODB_URL),
    ElasticModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
