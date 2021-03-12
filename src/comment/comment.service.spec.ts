import { Test, TestingModule } from '@nestjs/testing';
import { Model, Types } from 'mongoose';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule, getModelToken } from '@nestjs/mongoose';
import { CommentService } from './comment.service';
import { Comment, CommentSchema } from './comment.schema';
import { UpdateCommentArgs } from './comment.dto';

describe('CommentService', () => {
  let service: CommentService;
  let module: TestingModule;
  let mongoose: Model<Comment>;

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
          {
            name: Comment.name,
            schema: CommentSchema,
          },
        ]),
        RootModule,
      ],
      providers: [CommentService],
    }).compile();

    service = module.get<CommentService>(CommentService);
    mongoose = module.get<Model<Comment>>(getModelToken(Comment.name));

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

  it('should create comment', async () => {
    const res = await service.createComment({
      userId: new Types.ObjectId(),
      mediaId: new Types.ObjectId(),
      text: 'asdfasdf',
    });
    expect(await mongoose.findById(res._id)).toBeDefined();
  });

  it('should get comment', async () => {
    const comment = await service.createComment({
      userId: new Types.ObjectId(),
      mediaId: new Types.ObjectId(),
      text: 'asdfasdf',
    });
    const res = await service.getComments({ ids: [comment._id] });
    expect(res[0]._id).toEqual(comment._id);
    expect(res[0].userId).toEqual(comment.userId);
    expect(res[0].mediaId).toEqual(comment.mediaId);
    expect(res[0].text).toEqual(comment.text);
    expect(res[0].parentId).toBeNull();
  });

  it('should update comment', async () => {
    const comment = await service.createComment({
      parentId: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      mediaId: new Types.ObjectId(),
      text: 'asdfasdf',
    });
    const args: UpdateCommentArgs = {
      _id: comment._id,
      text: 'newnewnewnew',
    };
    await service.updateComment(args);
    const newComment = await mongoose.findById(comment._id);
    expect(newComment.text).toEqual(args.text);
  });

  it('should delete comment', async () => {
    const comment = await service.createComment({
      parentId: new Types.ObjectId(),
      userId: new Types.ObjectId(),
      mediaId: new Types.ObjectId(),
      text: 'asdf',
    });
    await service.deleteComment(comment._id);
    expect(await service.getComments({ ids: [comment._id] })).toHaveLength(0);
  });

  it("should get comment's tree", async () => {
    const root = await service.createComment({
      userId: new Types.ObjectId(),
      mediaId: new Types.ObjectId(),
      text: 'root',
    });
    const child1 = await service.createComment({
      parentId: root._id,
      userId: new Types.ObjectId(),
      mediaId: root.mediaId,
      text: 'child1',
    });
    const child2 = await service.createComment({
      parentId: root._id,
      userId: new Types.ObjectId(),
      mediaId: root.mediaId,
      text: 'child2',
    });
    const child11 = await service.createComment({
      parentId: child1._id,
      userId: new Types.ObjectId(),
      mediaId: root.mediaId,
      text: 'child11',
    });
    const child12 = await service.createComment({
      parentId: child1._id,
      userId: new Types.ObjectId(),
      mediaId: root.mediaId,
      text: 'child12',
    });
    const commentsForMedia = await service.commentsForMedia(root.mediaId);
    expect(commentsForMedia[0].children).toHaveLength(2);
    expect(commentsForMedia[0].children[0].commentId).toEqual(child1._id);
    expect(commentsForMedia[0].children[0].children).toHaveLength(2);
    expect(commentsForMedia[0].children[0].children[0].commentId).toEqual(
      child11._id,
    );
    expect(commentsForMedia[0].children[0].children[1].commentId).toEqual(
      child12._id,
    );
    expect(commentsForMedia[0].children[1].commentId).toEqual(child2._id);
    expect(commentsForMedia[0].children[1].children).toHaveLength(0);
  });
});
