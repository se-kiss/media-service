import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { CommentService } from './comment.service';
import {
  CreateCommentArgs,
  GetCommentsArgs,
  UpdateCommentArgs,
  DeleteCommentArgs,
} from './comment.dto';
import { Comment } from './comment.schema';

@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @GrpcMethod('CommentService', 'CreateComment')
  async createComment(args: CreateCommentArgs): Promise<Comment> {
    try {
      return await this.commentService.createComment(args);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('CommentService', 'GetComments')
  async getComments(args: GetCommentsArgs): Promise<{ comments: Comment[] }> {
    try {
      return { comments: await this.commentService.getComments(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('CommentService', 'UpdateComment')
  async updateComment(args: UpdateCommentArgs): Promise<Comment> {
    try {
      return await this.commentService.updateComment(args);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: args._id.toHexString(),
        });
      } else {
        throw new RpcException({
          code: status.INTERNAL,
          message: e.message,
        });
      }
    }
  }

  @GrpcMethod('CommentService', 'DeleteComment')
  async deleteComment(args: DeleteCommentArgs): Promise<Comment> {
    try {
      return await this.commentService.deleteComment(args._id);
    } catch (e) {
      if (e instanceof NotFoundException) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: args._id.toHexString(),
        });
      } else {
        throw new RpcException({
          code: status.INTERNAL,
          message: e.message,
        });
      }
    }
  }
}
