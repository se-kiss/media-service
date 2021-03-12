import { Types, Document } from 'mongoose';
import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';

export interface IComment {
  parentId?: Types.ObjectId;
  userId: Types.ObjectId;
  mediaId: Types.ObjectId;
  text: string;
  _createdAt: Date;
  _updatedAt: Date;
}

@Schema({
  timestamps: {
    createdAt: '_createdAt',
    updatedAt: '_updatedAt',
  },
})
export class Comment extends Document implements IComment {
  _createdAt: Date;
  _updatedAt: Date;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  parentId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, required: true })
  mediaId: Types.ObjectId;

  @Prop({ type: String, required: true })
  text: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
