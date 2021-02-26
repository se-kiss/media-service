import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Media } from './media.schema';
import { CreateMediaArgs, GetMediaArgs, UpdateMediaArgs } from './media.dto';

@Injectable()
export class MediaService implements OnModuleInit {
  constructor(
    @InjectModel(Media.name)
    private readonly mediaModel: Model<Media>,
  ) {}

  async onModuleInit() {
    await this.mediaModel.syncIndexes();
  }

  async createMedia(media: CreateMediaArgs): Promise<Media> {
    const createdMedia = new this.mediaModel(media);
    return await createdMedia.save();
  }

  async getMedia({ ids, filters }: GetMediaArgs): Promise<Media[]> {
    const media = this.mediaModel.find({});
    if (filters && filters.type) media.find({ type: filters.type });
    if (filters && filters.playlistId)
      media.find({ playlistId: filters.playlistId });
    if (filters && filters.tagIds)
      media.find({ tagIds: { $in: filters.tagIds } });
    ids && media.find({ _id: { $in: ids } });
    return await media.exec();
  }

  async updateMedia(media: UpdateMediaArgs): Promise<Media> {
    const updatedMedia = await this.mediaModel.findByIdAndUpdate(media._id, {
      ...media,
      _updatedAt: new Date(),
    });
    if (!updatedMedia) throw new NotFoundException();
    return await this.mediaModel.findById(updatedMedia._id).exec();
  }

  async deleteMedia(_id: Types.ObjectId): Promise<Media> {
    return await this.mediaModel.findByIdAndDelete(_id).exec();
  }
}
