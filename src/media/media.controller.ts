import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { MediaService } from './media.service';
import {
  CreateMediaArgs,
  GetMediaArgs,
  UpdateMediaArgs,
  DeleteMediaArgs,
} from './media.dto';
import { Media } from './media.schema';

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @GrpcMethod('MediaService', 'CreateMedia')
  async createMedia(args: CreateMediaArgs): Promise<Media> {
    try {
      return await this.mediaService.createMedia(args);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('MediaService', 'GetMedia')
  async getMedia(args: GetMediaArgs): Promise<{ media: Media[] }> {
    try {
      return { media: await this.mediaService.getMedia(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('MediaService', 'UpdateMedia')
  async updateMedia(args: UpdateMediaArgs): Promise<Media> {
    try {
      return await this.mediaService.updateMedia(args);
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

  @GrpcMethod('MediaService', 'DeleteMedia')
  async deleteMedia(args: DeleteMediaArgs): Promise<Media> {
    try {
      return await this.mediaService.deleteMedia(args._id);
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
