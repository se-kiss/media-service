import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Comment } from './comment.schema';
import {
  CreateCommentArgs,
  GetCommentsArgs,
  UpdateCommentArgs,
  CommentForMedia,
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
    if (filters && filters.userId) comment.find({ userId: filters.userId });
    if (filters && filters.parentId !== undefined)
      comment.find({ parentId: filters.parentId });
    ids && comment.find({ _id: { $in: ids } });
    return await comment.exec();
  }

  async fillChildComment(comment: Comment): Promise<CommentForMedia[]> {
    const res = [];
    const children = await this.getComments({
      filters: { parentId: comment._id },
    });
    for (const child of children) {
      const cur = {
        commentId: child._id,
        children: await this.fillChildComment(child),
      };
      res.push(cur);
    }
    return res;
  }

  async commentsForMedia(mediaId: Types.ObjectId): Promise<CommentForMedia[]> {
    const res = [];
    const rootComment = await this.getComments({
      filters: { mediaId, parentId: null },
    });
    for (const comment of rootComment) {
      const cur = await this.fillChildComment(comment);
      res.push({ commentId: comment._id, children: cur });
    }
    return res;
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
