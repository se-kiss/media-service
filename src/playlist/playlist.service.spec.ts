import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistService } from './playlist.service';
import { Model, Types } from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { Playlist, PlaylistSchema } from './playlist.schema';
import { UpdatePlaylistArgs } from './playlist.dto';

describe('PlaylistService', () => {
  let service: PlaylistService;
  let module: TestingModule;
  let mongoose: Model<Playlist>;

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
        MongooseModule.forFeature([
          { name: Playlist.name, schema: PlaylistSchema },
        ]),
        RootModule,
      ],
      providers: [PlaylistService],
    }).compile();

    service = module.get<PlaylistService>(PlaylistService);
    mongoose = module.get<Model<Playlist>>(getModelToken(Playlist.name));

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

  it('should create playlist', async () => {
    const res = await service.createPlaylist({
      name: 'test',
      ownerId: new Types.ObjectId(),
    });
    expect(await mongoose.findById(res._id)).toBeDefined();
  });

  it('should get playlist', async () => {
    const playlist = await service.createPlaylist({
      name: 'test2',
      ownerId: new Types.ObjectId(),
    });
    const res = await service.getPlaylists({ ids: [playlist._id] });
    expect(res[0]._id).toEqual(playlist._id);
    expect(res[0].name).toEqual(playlist.name);
    expect(res[0].ownerId).toEqual(playlist.ownerId);
  });

  it('should update playlist', async () => {
    const playlist = await service.createPlaylist({
      name: 'test3',
      ownerId: new Types.ObjectId(),
    });
    const args: UpdatePlaylistArgs = {
      _id: playlist._id,
      name: 'kuyrai',
      description: 'yesped',
    };
    await service.updatePlaylist(args);
    const newPlaylist = await mongoose.findById(playlist._id);
    expect(newPlaylist.name).toEqual(args.name);
    expect(newPlaylist.description).toEqual(args.description);
  });

  it('should delete playlist', async () => {
    const playlist = await service.createPlaylist({
      name: 'test4',
      ownerId: new Types.ObjectId(),
    });
    await service.deletePlaylist(playlist._id);
    expect(await service.getPlaylists({ ids: [playlist._id] })).toHaveLength(0);
  });
});
