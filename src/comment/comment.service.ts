import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.schema';
import {
  CreateCommentArgs,
  GetCommentsArgs,
  UpdateCommentArgs,
} from './comment.dto';

@Injectable()
export class CommentService implements OnModuleInit {
  constructor(
    @InjectModel(Comment.name)
    private readonly commentModel: Model<Comment>,
  ) {}

  async onModuleInit() {
    await this.commentModel.syncIndexes();
  }

  async createComment(comment: CreateCommentArgs): Promise<Comment> {
    const createdComment = new this.commentModel(comment);
    return await createdComment.save();
  }

  async getComments({ ids, filters }: GetCommentsArgs): Promise<Comment[]> {
    const comment = this.commentModel.find({});
    if (filters && filters.mediaId) comment.find({ mediaId: filters.mediaId });
    if (filters && filters.parentId)
      comment.find({ parentId: filters.parentId });
    ids && comment.find({ _id: { $in: ids } });
    return await comment.exec();
  }

  async updateComment(comment: UpdateCommentArgs): Promise<Comment> {
    const updatedComment = await this.commentModel.findByIdAndUpdate(
      comment._id,
      {
        ...comment,
        _updatedAt: new Date(),
      },
    );
    if (!updatedComment) throw new NotFoundException();
    return await this.commentModel.findById(updatedComment._id).exec();
  }

  async deleteComment(_id: Types.ObjectId): Promise<Comment> {
    return await this.commentModel.findByIdAndDelete(_id).exec();
  }
}
