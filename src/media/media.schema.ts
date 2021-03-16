import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum MediaType {
  CLIP = 1,
  ARTICLE = 2,
  PODCAST = 3,
}

export interface IMedia {
  name: string;
  playlistId: Types.ObjectId;
  type: MediaType;
  tagIds: Types.ObjectId[];
  videoId?: string;
  paragraph?: string[];
  description?: string;
  _createdAt: Date;
  _updatedAt: Date;
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  },
})
export class Media extends Document implements IMedia {
  _createdAt: Date;
  _updatedAt: Date;

  @Prop({ type: Types.ObjectId, required: true })
  playlistId: Types.ObjectId;

  @Prop({ type: MediaType, required: true })
  type: MediaType;

  @Prop({ type: [Types.ObjectId], required: true })
  tagIds: Types.ObjectId[];

  @Prop({ type: String, required: false })
  videoId?: string;

  @Prop({ type: [String], required: false })
  paragraph?: string[];

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
