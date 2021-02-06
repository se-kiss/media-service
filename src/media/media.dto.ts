import { Transform, Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { IMedia } from './media.schema';
import { Types } from 'mongoose';

export class CreateMediaArgs
  implements Omit<IMedia, '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  playlistId: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  name: string;

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
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  playlistId: Types.ObjectId;
}

export class GetMediaArgs {
  @IsOptional()
  @Transform(value => new Types.ObjectId(value))
  ids?: Types.ObjectId[];

  @IsOptional()
  @ValidateNested()
  @Type(() => GetMediaFilter)
  filter?: GetMediaFilter;
}

export class DeleteMediaArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
