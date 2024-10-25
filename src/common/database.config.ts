import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Director } from 'src/director/entity/director.entity';
import { Genre } from 'src/genre/entity/genre.entity';
import { MovieDetail } from 'src/movie/entity/movie-detail.entity';
import { Movie } from 'src/movie/entity/movie.entity';
import { User } from 'src/user/entities/user.entity';
import { envKeys } from './const/env.const';
import { MovieUserLike } from 'src/movie/entity/movie-user-like.entity';

export const databaseConfig = {
  useFactory: (configService: ConfigService): TypeOrmModuleOptions => {
    return {
      type: configService.get<string>(envKeys.dbType) as 'postgres',
      host: configService.get<string>(envKeys.dbHost),
      port: configService.get<number>(envKeys.dbPort),
      username: configService.get<string>(envKeys.dbUsername),
      password: configService.get<string>(envKeys.dbPassword),
      database: configService.get<string>(envKeys.dbDatabase),
      entities: [Movie, MovieDetail, Director, Genre, User, MovieUserLike],
      synchronize: true,
    };
  },
  inject: [ConfigService],
};
