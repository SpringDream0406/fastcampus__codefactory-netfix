import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Genre } from './entity/genre.entity';
import { Repository } from 'typeorm';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre)
    private readonly genreRepository: Repository<Genre>,
  ) {}

  async create(createGenreDto: CreateGenreDto) {
    const genre = await this.genreRepository.exists({
      where: { name: createGenreDto.name },
    });
    // if (genre) throw new BadRequestException('존재하는 장르입니다!');

    return this.genreRepository.save(createGenreDto);
  }

  findAll() {
    return this.genreRepository.find();
  }

  findOne(id: number) {
    return this.genreRepository.findOne({ where: { id } });
  }

  update(id: number, updateGenreDto: UpdateGenreDto) {
    return this.genreRepository.update({ id }, { ...updateGenreDto });
  }

  remove(id: number) {
    return this.genreRepository.delete(id);
  }
}
