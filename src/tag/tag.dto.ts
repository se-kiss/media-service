import { ITag } from './tag.schema';
import { Types } from 'mongoose';
import { IsNotEmpty, IsString, IsOptional, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';

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

export class GetTagsArgs {
  @IsOptional()
  @IsArray()
  @Transform((values: string[]) => {
    return values.length === 0
      ? undefined
      : values.map(value => new Types.ObjectId(value));
  })
  ids?: Types.ObjectId[];
}

export class DeleteTagArgs {
  @IsNotEmpty()
  @Transform(value => new Types.ObjectId(value))
  _id: Types.ObjectId;
}
