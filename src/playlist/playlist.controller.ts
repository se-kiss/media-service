import { Controller, NotFoundException } from '@nestjs/common';
import { GrpcMethod, RpcException } from '@nestjs/microservices';
import { status } from 'grpc';
import { PlaylistService } from './playlist.service';
import { Playlist } from './playlist.schema';
import {
  CreatePlaylistArgs,
  GetPlaylistsArgs,
  UpdatePlaylistArgs,
  DeletePlaylistArgs,
} from './playlist.dto';

@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @GrpcMethod('PlaylistService', 'CreatePlaylist')
  async createPlayList(args: CreatePlaylistArgs): Promise<Playlist> {
    try {
      return await this.playlistService.createPlaylist(args);
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('PlaylistService', 'GetPlaylists')
  async getPlaylists(
    args: GetPlaylistsArgs,
  ): Promise<{ playlists: Playlist[] }> {
    try {
      return { playlists: await this.playlistService.getPlaylists(args) };
    } catch (e) {
      throw new RpcException({
        code: status.INTERNAL,
        message: e.message,
      });
    }
  }

  @GrpcMethod('PlaylistService', 'UpdatePlaylist')
  async updatePlaylist(args: UpdatePlaylistArgs): Promise<Playlist> {
    try {
      return await this.playlistService.updatePlaylist(args);
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

  @GrpcMethod('PlaylistService', 'DeletePlaylist')
  async deletePlaylist(args: DeletePlaylistArgs): Promise<Playlist> {
    try {
      return await this.playlistService.deletePlaylist(args._id);
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
