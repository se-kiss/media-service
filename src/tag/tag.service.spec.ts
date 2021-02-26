import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { TagService } from './tag.service';
import { Tag, TagSchema } from './tag.schema';
import { UpdateTagArgs } from './tag.dto';

describe('TagService', () => {
  let service: TagService;
  let module: TestingModule;
  let mongoose: Model<Tag>;

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
        MongooseModule.forFeature([{ name: Tag.name, schema: TagSchema }]),
        RootModule,
      ],
      providers: [TagService],
    }).compile();

    service = module.get<TagService>(TagService);
    mongoose = module.get<Model<Tag>>(getModelToken(Tag.name));

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

  it('should create tag', async () => {
    const res = await service.createTag({
      name: 'testname',
      color: '#123456',
    });
    expect(await mongoose.findById(res._id)).toBeDefined();
  });

  it('should get tags', async () => {
    const tag = await service.createTag({
      name: 'testname2',
      color: '#234567',
    });
    const res = await service.getTags({ ids: [tag._id] });
    expect(res[0]._id).toEqual(tag._id);
    expect(res[0].name).toEqual(tag.name);
    expect(res[0].color).toEqual(tag.color);
  });

  it('should not get non-exist tag', async () => {
    expect(await service.getTags({ ids: [new Types.ObjectId()] })).toHaveLength(
      0,
    );
  });

  it('should update tag', async () => {
    const tag = await service.createTag({
      name: 'testname3',
      color: '#345678',
    });
    const args: UpdateTagArgs = {
      _id: tag._id,
      color: '#color',
    };
    await service.updateTag(args);
    const newTag = await mongoose.findById(tag._id);
    expect(newTag.color).toEqual(args.color);
  });

  it('should delete tag', async () => {
    const tag = await service.createTag({
      name: 'testname4',
      color: '#color2',
    });
    await service.deleteTag(tag._id);
    expect(await service.getTags({ ids: [tag._id] })).toHaveLength(0);
  });
});
