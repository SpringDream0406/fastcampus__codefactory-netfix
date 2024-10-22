import { PickType } from '@nestjs/mapped-types';
import { Movie } from '../entity/movie.entity';
import { ArrayNotEmpty, IsArray, IsNumber } from 'class-validator';

export class CreateMovieDto extends PickType(Movie, ['title', 'genres']) {
  detail: string;
  directorId: number;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber({}, { each: true })
  genreIds: number[];
}
