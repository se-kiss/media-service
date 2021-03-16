import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { MediaService } from './media.service';
import { Media, MediaSchema, MediaType } from './media.schema';
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
      name: 'test',
      type: MediaType.CLIP,
      videoId: 'test.com',
      tagIds: [new Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
      paragraph: ['test', 'test2'],
      description: 'test',
    });
    expect(await mongoose.findById(res._id)).toBeDefined();
  });

  it('should get media', async () => {
    const media = await service.createMedia({
      playlistId: new Types.ObjectId(),
      name: 'test2',
      type: MediaType.ARTICLE,
      videoId: 'test2.com',
      podcastKey: 'key',
      tagIds: [new Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
      paragraph: ['test', 'test2'],
      description: 'test2',
    });
    const res = await service.getMedia({ ids: [media._id] });
    expect(res[0]._id).toEqual(media._id);
    expect(res[0].playlistId).toEqual(media.playlistId);
    expect(res[0].name).toEqual(media.name);
    expect(res[0].videoId).toEqual(media.videoId);
    expect(res[0].tagIds[0]).toEqual(media.tagIds[0]);
    expect(res[0].paragraph.length).toEqual(media.paragraph.length);
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
      name: 'test3',
      type: MediaType.CLIP,
      videoId: 'test3.com',
      podcastKey: 'key2',
      tagIds: [new Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
      paragraph: ['test', 'test2'],
      description: 'test3',
    });
    const args: UpdateMediaArgs = {
      _id: media._id,
      name: 'new title',
      paragraph: ['kuy1', 'kuy2'],
    };
    await service.updateMedia(args);
    const newMedia = await mongoose.findById(media._id);
    expect(newMedia.name).toEqual(args.name);
    expect(newMedia.paragraph.length).toEqual(args.paragraph.length);
  });

  it('should delete media', async () => {
    const media = await service.createMedia({
      playlistId: new Types.ObjectId(),
      name: 'test4',
      type: MediaType.ARTICLE,
      videoId: 'test4.com',
      tagIds: [new Types.ObjectId('aaaaaaaaaaaaaaaaaaaaaaaa')],
      paragraph: ['test', 'test2'],
      description: 'test4',
    });
    await service.deleteMedia(media._id);
    expect(await service.getMedia({ ids: [media._id] })).toHaveLength(0);
  });
});
