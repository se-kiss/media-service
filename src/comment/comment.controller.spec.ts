import { Test, TestingModule } from '@nestjs/testing';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './comment.schema';

describe('CommentController', () => {
  let service: CommentService;
  let controller: CommentController;
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
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
        ]),
        RootModule,
      ],
      providers: [CommentService],
      controllers: [CommentController],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    service = module.get<CommentService>(CommentService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
