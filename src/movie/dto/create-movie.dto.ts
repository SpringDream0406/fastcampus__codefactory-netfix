import { PickType } from '@nestjs/mapped-types';
import { Movie } from '../entity/movie.entity';
import { ArrayNotEmpty, IsArray, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMovieDto extends PickType(Movie, ['title']) {
  @IsString()
  detail: string;

  @IsNumber()
  directorId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  @Type(() => Number)
  genreIds: number[];

  @IsString()
  movieFileName: string;
}
