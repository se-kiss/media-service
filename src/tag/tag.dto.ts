import { Types } from 'mongoose';
import { ITag } from './tag.schema';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateTagArgs implements Omit<ITag, '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  color: string;
}

export class UpdateTagArgs
  implements Omit<ITag, 'name' | '_createdAt' | '_updatedAt'> {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;

  @IsNotEmpty()
  @IsString()
  color: string;
}

export class GetTagsFilter {
  @IsNotEmpty()
  @IsString()
  name: string;
}

export class GetTagsArgs {
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
  @Type(() => GetTagsFilter)
  filter?: GetTagsFilter;
}

export class DeleteTagArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
