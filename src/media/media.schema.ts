import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export interface IMedia {
  title: string;
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

  @Prop({ type: Types.ObjectId })
  playlistId: Types.ObjectId;

  @Prop({ type: String, required: false })
  url?: string;

  @Prop({ type: String, required: false })
  content?: string;

  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false })
  description?: string;
}

export const MediaSchema = SchemaFactory.createForClass(Media);
