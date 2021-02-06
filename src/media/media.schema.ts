import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface IMedia {
  name: string;
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

  @Prop({ type: String, required: false })
  url?: string;

  @Prop({ type: String, required: false })
  content?: string;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: false })
  description?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
