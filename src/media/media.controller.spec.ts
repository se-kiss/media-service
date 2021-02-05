import { Test, TestingModule } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MediaController } from './media.controller';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './media.schema';

describe('MediaController', () => {
  let service: MediaService;
  let controller: MediaController;
  let module: TestingModule;

  beforeAll(async () => {
    @Module({
      imports: [
        ConfigModule.forRoot(),
        MongooseModule.forRoot(process.env.MONGODB_URL),
      ],
    })
    class RootModule {}

    module = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
        RootModule,
      ],
      providers: [MediaService],
      controllers: [MediaController],
    }).compile();

    controller = module.get<MediaController>(MediaController);
    service = module.get<MediaService>(MediaService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
