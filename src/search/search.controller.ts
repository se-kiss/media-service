import { Controller } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { SearchService } from './search.service';
import { SearchArgs, SearchBody, DeleteArgs } from './search.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @GrpcMethod('SearchService', 'IndexMedia')
  async indexMedia(args: SearchBody): Promise<{ statusCode: number }> {
    try {
      return { statusCode: await this.searchService.indexMedia(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: e.message,
      });
    }
  }

  @GrpcMethod('SearchService', 'Search')
  async search(args: SearchArgs): Promise<{ res: SearchBody[] }> {
    try {
      return { res: await this.searchService.search(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INVALID_ARGUMENT,
        message: e.message,
      });
    }
  }

  @GrpcMethod('SearchService', 'Update')
  async update(args: SearchBody): Promise<{ statusCode: number }> {
    try {
      return { statusCode: await this.searchService.update(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('SearchService', 'Remove')
  async remove(args: DeleteArgs): Promise<{ statusCode: number }> {
    try {
      return { statusCode: await this.searchService.remove(args.playlistId) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('SearchService', 'ClearIndex')
  async clearIndex(): Promise<{ statusCode: number }> {
    try {
      return { statusCode: await this.searchService.clearIndex() };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }
}
