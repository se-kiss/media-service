import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Tag } from './tag.schema';
import { CreateTagArgs, GetTagsArgs, UpdateTagArgs } from './tag.dto';

@Injectable()
export class TagService implements OnModuleInit {
  constructor(
    @InjectModel(Tag.name)
    private readonly tagModel: Model<Tag>,
  ) {}

  async onModuleInit() {
    await this.tagModel.syncIndexes();
  }

  async createTag(tag: CreateTagArgs): Promise<Tag> {
    const createdTag = new this.tagModel(tag);
    return await createdTag.save();
  }

  async getTags({ ids, filter }: GetTagsArgs): Promise<Tag[]> {
    const tag = this.tagModel.find({});
    if (filter) tag.find({ name: filter.name });
    ids && tag.find({ _id: { $in: ids } });
    return await tag.exec();
  }

  async updateTag(tag: UpdateTagArgs): Promise<Tag> {
    const updatedTag = await this.tagModel.findByIdAndUpdate(tag._id, {
      ...tag,
      _updatedAt: new Date(),
    });
    if (!updatedTag) throw new NotFoundException();
    return await this.tagModel.findById(updatedTag._id).exec();
  }

  async deleteTag(_id: Types.ObjectId): Promise<Tag> {
    return await this.tagModel.findByIdAndDelete(_id).exec();
  }
}
