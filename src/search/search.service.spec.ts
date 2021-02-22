import { Test, TestingModule } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import {
  ElasticsearchModule,
  ElasticsearchService,
} from '@nestjs/elasticsearch';
import { SearchArgs, SearchBody } from './search.dto';
import { SearchService } from './search.service';

describe('SearchService', () => {
  let service: SearchService;
  let module: TestingModule;
  let es: ElasticsearchService;

  beforeAll(async () => {
    @Module({
      imports: [ConfigModule.forRoot()],
    })
    class RootModule {}

    module = await Test.createTestingModule({
      imports: [
        ElasticsearchModule.registerAsync({
          useFactory: async () => ({
            node: process.env.ELASTICSEARCH_NODE,
            auth: {
              username: process.env.ELASTICSEARCH_USERNAME,
              password: process.env.ELASTICSEARCH_PASSWORD,
            },
          }),
        }),
        RootModule,
      ],
      providers: [SearchService],
    }).compile();

    service = module.get<SearchService>(SearchService);
    es = module.get<ElasticsearchService>(ElasticsearchService);
    es.on('response', (err, _) => {
      if (err) console.log(err);
    });
    await service.clearIndex();
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(es).toBeDefined();
  });

  it('should be indexed', async () => {
    const res = await service.indexMedia({
      playlistId: 'cccccccccccccccccccccccc',
      name: 'test',
      ownerName: 'nest',
      tags: ['kuy'],
      types: ['hee'],
    });
    expect(res).toEqual(201);
  });

  it('should search', async () => {
    const args: SearchArgs = {
      text: '*test*',
      size: 10,
      from: 0,
      tags: [],
      types: [],
    };
    expect(await service.search(args)).toBeDefined();
  });

  it('should delete doc', async () => {
    await service.indexMedia({
      playlistId: 'bbbbbbbbbbbbbbbbbbbbbbbb',
      name: 'test',
      ownerName: 'nest',
      tags: ['kuy'],
      types: ['hee'],
    });
    const res = await service.remove('bbbbbbbbbbbbbbbbbbbbbbbb');
    expect(res).toEqual(200);
  });

  it('should update doc', async () => {
    await service.indexMedia({
      playlistId: 'dddddddddddddddddddddddd',
      name: 'test',
      ownerName: 'nest',
      tags: ['kuy'],
      types: ['hee'],
    });
    const args: SearchBody = {
      playlistId: 'dddddddddddddddddddddddd',
      name: 'yes ped',
      ownerName: 'kuay',
      tags: ['kuy', 'hee'],
      types: ['ped'],
    };
    const res = await service.update(args);
    expect(res).toEqual(200);
  });
});
