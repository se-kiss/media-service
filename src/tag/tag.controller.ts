import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { TagService } from './tag.service';
import {
  CreateTagArgs,
  GetTagsArgs,
  UpdateTagArgs,
  DeleteTagArgs,
} from './tag.dto';
import { Tag } from './tag.schema';

@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @GrpcMethod('TagService', 'CreateTag')
  async createTag(args: CreateTagArgs): Promise<Tag> {
    try {
      return await this.tagService.createTag(args);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('TagService', 'GetTags')
  async getTags(args: GetTagsArgs): Promise<{ tags: Tag[] }> {
    try {
      return { tags: await this.tagService.getTags(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('TagService', 'UpdateTag')
  async updateTag(args: UpdateTagArgs): Promise<Tag> {
    try {
      return await this.tagService.updateTag(args);
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

  @GrpcMethod('TagService', 'DeleteTag')
  async deleteTag(args: DeleteTagArgs): Promise<Tag> {
    try {
      return await this.tagService.deleteTag(args._id);
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
