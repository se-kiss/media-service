import { Document } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export interface ITag {
  name: string;
  color: string;
  _createdAt: Date;
  _updatedAt: Date;
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  },
})
export class Tag extends Document implements ITag {
  _createdAt: Date;
  _updatedAt: Date;

  @Prop({ type: String, unique: true, required: true })
  name: string;

  @Prop({ type: String, unique: true, required: true })
  color: string;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
