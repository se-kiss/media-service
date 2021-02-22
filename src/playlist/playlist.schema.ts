import { Types, Document } from 'mongoose';
import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export interface IPlaylist {
  name: string;
  ownerId: Types.ObjectId;
  tagIds: Types.ObjectId[];
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
export class Playlist extends Document implements IPlaylist {
  _createdAt: Date;
  _updatedAt: Date;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: Types.ObjectId, required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: [Types.ObjectId], required: true })
  tagIds: Types.ObjectId[];

  @Prop({ type: String, required: false })
  description?: string;
}

export const PlaylistSchema = SchemaFactory.createForClass(Playlist);
