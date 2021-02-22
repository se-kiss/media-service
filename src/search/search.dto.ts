import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchBody {
  @IsNotEmpty()
  @IsString()
  playlistId: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  ownerName: string;

  @IsNotEmpty()
  @IsArray()
  @Transform((values: string[]) => values.map(value => value.toLowerCase()))
  tags: string[];

  @IsNotEmpty()
  @IsArray()
  @Transform((values: string[]) => values.map(value => value.toLowerCase()))
  types: string[];

  @IsOptional()
  @IsString()
  description?: string;
}

export class SearchArgs {
  @IsNotEmpty()
  @IsString()
  text: string;

  @IsNotEmpty()
  @IsNumber()
  from: number;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsNotEmpty()
  @IsArray()
  @Transform((values: string[]) => values.map(value => value.toLowerCase()))
  tags: string[];

  @IsNotEmpty()
  @IsArray()
  @Transform((values: string[]) => values.map(value => value.toLowerCase()))
  types: string[];
}

export class DeleteArgs {
  @IsNotEmpty()
  @IsString()
  playlistId: string;
}
