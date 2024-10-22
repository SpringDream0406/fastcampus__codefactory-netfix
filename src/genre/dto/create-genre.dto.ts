import { PickType } from '@nestjs/mapped-types';
import { Genre } from '../entity/genre.entity';

export class CreateGenreDto extends PickType(Genre, ['name']) {}
