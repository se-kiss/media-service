import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
  IsArray,
  IsEnum,
  isEmpty,
} from 'class-validator';
import { IMedia, MediaType } from './media.schema';
import { Types } from 'mongoose';

const EmptyTransform = () =>
  Transform(value =>
    isEmpty(value) || (Array.isArray(value) && value.length === 0)
      ? undefined
      : value,
  );

export class CreateMediaArgs
  implements Omit<IMedia, '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  playlistId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEnum(MediaType)
  type: MediaType;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdateMediaArgs
  implements Partial<Omit<IMedia, 'playlistId' | '_createdAt' | '_updatedAt'>> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  url?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GetMediaFilter {
  @EmptyTransform()
  @Transform(value => {
    if (!value || !/\S/.test(value)) return undefined;
    else return new Types.ObjectId(value);
  })
  playlistId?: Types.ObjectId;

  @Transform(value => (value === 0 ? undefined : value))
  type?: MediaType;
}

export class GetMediaArgs {
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
  @Type(() => GetMediaFilter)
  filters?: GetMediaFilter;
}

export class DeleteMediaArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
