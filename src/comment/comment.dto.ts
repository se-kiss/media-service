import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  isEmpty,
} from 'class-validator';
import { IComment, Comment } from './comment.schema';

const EmptyTransform = () =>
  Transform(value =>
    isEmpty(value) || (Array.isArray(value) && value.length === 0)
      ? undefined
      : value,
  );

export class CreateCommentArgs
  implements Omit<IComment, '_createdAt' | '_updatedAt'> {
  @EmptyTransform()
  @Transform(value =>
    value === undefined ? undefined : new Types.ObjectId(value),
  )
  parentId?: Types.ObjectId;

  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  userId: Types.ObjectId;

  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  mediaId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class UpdateCommentArgs
  implements
    Partial<
      Omit<
        IComment,
        'mediaId' | 'parentId' | '_createdAt' | '_updatedAt' | 'userId'
      >
    > {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  text: string;
}

export class GetCommentsFilters {
  @EmptyTransform()
  @Transform(value => {
    if (!value || !/\S/.test(value)) return undefined;
    else return new Types.ObjectId(value);
  })
  parentId?: Types.ObjectId;

  @EmptyTransform()
  @Transform(value => {
    if (!value || !/\S/.test(value)) return undefined;
    else return new Types.ObjectId(value);
  })
  mediaId?: Types.ObjectId;
}

export class GetCommentsArgs {
  @IsOptional()
  @IsArray()
  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  ids?: Types.ObjectId[];

  @IsOptional()
  @ValidateNested()
  @Type(() => GetCommentsFilters)
  filters?: GetCommentsFilters;
}

export class DeleteCommentArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}

export class CommentForMedia {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  commentId: Types.ObjectId;

  @IsNotEmpty()
  @IsArray()
  children: CommentForMedia[];
}

export class CommentsForMediaArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  mediaId: Types.ObjectId;
}
