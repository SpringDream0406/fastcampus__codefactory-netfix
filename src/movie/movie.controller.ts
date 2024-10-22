import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieTitleValidationPipe } from './pipe/movie-title-validation.pipe';

@Controller('movie')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

  @Get()
  getMoives(
    @Query('title', MovieTitleValidationPipe) title: string, //
  ) {
    return this.movieService.findAll(title);
  }

  @Get(':id')
  getMovie(
    @Param(
      'id',
      new ParseIntPipe({
        exceptionFactory(error) {
          throw new BadRequestException('숫자를 입력해주세요!');
        },
      }),
    )
    id: number, //
  ) {
    return this.movieService.findOne(id);
  }

  @Post()
  postMovie(
    @Body() body: CreateMovieDto, //
  ) {
    return this.movieService.create(body);
  }

  @Patch(':id')
  patchMovie(
    @Param('id', ParseIntPipe) id: number, //
    @Body() body: any,
  ) {
    return this.movieService.update(id, body);
  }

  @Delete(':id')
  deleteMovie(
    @Param('id', ParseIntPipe) id: number, //
  ) {
    return this.movieService.remove(id);
  }
}
