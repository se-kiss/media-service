import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Playlist } from './playlist.schema';
import {
  CreatePlaylistArgs,
  GetPlaylistsArgs,
  UpdatePlaylistArgs,
} from './playlist.dto';

@Injectable()
export class PlaylistService implements OnModuleInit {
  constructor(
    @InjectModel(Playlist.name)
    private readonly playlistModel: Model<Playlist>,
  ) {}

  async onModuleInit() {
    await this.playlistModel.syncIndexes();
  }

  async createPlaylist(playlist: CreatePlaylistArgs): Promise<Playlist> {
    const createdPlaylist = new this.playlistModel(playlist);
    return await createdPlaylist.save();
  }

  async getPlaylists({ ids, filters }: GetPlaylistsArgs): Promise<Playlist[]> {
    const playlist = this.playlistModel.find({});
    if (filters && filters.ownerId) playlist.find({ ownerId: filters.ownerId });
    ids && playlist.find({ _id: { $in: ids } });
    return await playlist.exec();
  }

  async updatePlaylist(playlist: UpdatePlaylistArgs): Promise<Playlist> {
    const updatedPlaylist = await this.playlistModel.findByIdAndUpdate(
      playlist._id,
      {
        ...playlist,
        _updatedAt: new Date(),
      },
    );
    if (!updatedPlaylist) throw new NotFoundException();
    return await this.playlistModel.findById(updatedPlaylist._id).exec();
  }

  async deletePlaylist(_id: Types.ObjectId): Promise<Playlist> {
    return await this.playlistModel.findByIdAndDelete(_id).exec();
  }
}
