import { PickType } from '@nestjs/mapped-types';
import { Director } from '../entity/director.entity';

export class CreateDirectorDto extends PickType(Director, [
  'name',
  'dob',
  'nationality',
]) {}
