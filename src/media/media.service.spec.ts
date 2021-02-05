import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MediaService } from './media.service';
import { Media, MediaSchema } from './media.schema';
import { UpdateMediaArgs } from './media.dto';

describe('MediaService', () => {
  let service: MediaService;
  let module: TestingModule;
  let mongoose: Model<Media>;

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
    }).compile();

    service = module.get<MediaService>(MediaService);
    mongoose = module.get<Model<Media>>(getModelToken(Media.name));

    await mongoose.deleteMany({});
    await mongoose.syncIndexes();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(mongoose).toBeDefined();
  });

  it('should create media', async () => {
    const res = await service.createMedia({
      playlistId: new Types.ObjectId(),
      title: 'test',
      url: 'test.com',
      content: 'test',
      description: 'test',
    });
    expect(await mongoose.findById(res._id)).toBeDefined();
  });

  it('should get media', async () => {
    const media = await service.createMedia({
      playlistId: new Types.ObjectId(),
      title: 'test2',
      url: 'test2.com',
      content: 'test2',
      description: 'test2',
    });
    const res = await service.getMedia({ ids: [media._id] });
    expect(res[0]._id).toEqual(media._id);
    expect(res[0].playlistId).toEqual(media.playlistId);
    expect(res[0].title).toEqual(media.title);
    expect(res[0].url).toEqual(media.url);
    expect(res[0].content).toEqual(media.content);
    expect(res[0].description).toEqual(media.description);
  });

  it('should not get non-exist media', async () => {
    expect(
      await service.getMedia({ ids: [new Types.ObjectId()] }),
    ).toHaveLength(0);
  });

  it('should update media', async () => {
    const media = await service.createMedia({
      playlistId: new Types.ObjectId(),
      title: 'test3',
      url: 'test3.com',
      content: 'test3',
      description: 'test3',
    });
    const args: UpdateMediaArgs = {
      _id: media._id,
      title: 'new title',
      content: 'new content',
    };
    await service.updateMedia(args);
    const newMedia = await mongoose.findById(media._id);
    expect(newMedia.title).toEqual(args.title);
    expect(newMedia.content).toEqual(args.content);
  });

  it('should delete media', async () => {
    const media = await service.createMedia({
      playlistId: new Types.ObjectId(),
      title: 'test4',
      url: 'test4.com',
      content: 'test4',
      description: 'test4',
    });
    await service.deleteMedia(media._id);
    expect(await service.getMedia({ ids: [media._id] })).toHaveLength(0);
  });
});
