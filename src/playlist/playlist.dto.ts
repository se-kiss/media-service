import { Types } from 'mongoose';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsArray,
  ValidateNested,
  isEmpty,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IPlaylist } from './playlist.schema';

const EmptyTransform = () =>
  Transform(value =>
    isEmpty(value) || (Array.isArray(value) && value.length === 0)
      ? undefined
      : value,
  );

export class CreatePlaylistArgs
  implements Omit<IPlaylist, '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  ownerId: Types.ObjectId;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePlaylistArgs
  implements
    Partial<Omit<IPlaylist, 'ownerId' | '_createdAt' | '_updatedAt' | 'type'>> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class GetPlaylistFilter {
  @EmptyTransform()
  @Transform(value => {
    if (!value || !/\S/.test(value)) return undefined;
    else return new Types.ObjectId(value);
  })
  ownerId?: Types.ObjectId;
}

export class GetPlaylistsArgs {
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
  @Type(() => GetPlaylistFilter)
  filters?: GetPlaylistFilter;
}

export class DeletePlaylistArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
