import { Exclude } from 'class-transformer';
import { IsEmail, IsString } from 'class-validator';
import { BaseTable } from 'src/common/entity/base-table.entity';
import { MovieUserLike } from 'src/movie/entity/movie-user-like.entity';
import { Movie } from 'src/movie/entity/movie.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export enum Role {
  admin,
  paidUser,
  user,
}

@Entity()
export class User extends BaseTable {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    unique: true,
  })
  @IsEmail()
  email: string;

  @Exclude({
    toPlainOnly: true,
  })
  @Column()
  @IsString()
  password: string;

  @Column({
    enum: Role,
    default: Role.user,
  })
  role: Role;

  @OneToMany(() => Movie, (movie) => movie.creator)
  createMovies: Movie[];

  @OneToMany(() => MovieUserLike, (mul) => mul.user)
  likedMovies: MovieUserLike[];
}
