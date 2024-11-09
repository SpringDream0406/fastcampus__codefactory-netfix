import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { Role, User } from 'src/user/entities/user.entity';
import { Director } from 'src/director/entity/director.entity';
import { Movie } from './entity/movie.entity';
import { DataSource } from 'typeorm';
import { MovieDetail } from './entity/movie-detail.entity';
import { MovieUserLike } from './entity/movie-user-like.entity';
import { Genre } from 'src/genre/entity/genre.entity';
import { AuthService } from 'src/auth/auth.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import * as fs from 'fs/promises';

describe('MovieController (e2e)', () => {
  let app: INestApplication;

  // 테스트 데이터 넣기 세팅
  let dataSource: DataSource;

  let users: User[];
  let directors: Director[];
  let movies: Movie[];
  let genres: Genre[];

  let token: string; // 인증용

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    // 파이프 설정
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
      }),
    );
    await app.init();

    // 테스트 데이터 넣기 세팅
    dataSource = app.get<DataSource>(DataSource);

    const movieRepository = dataSource.getRepository(Movie);
    const movieDetailRepository = dataSource.getRepository(MovieDetail);
    const userRepository = dataSource.getRepository(User);
    const directorRepository = dataSource.getRepository(Director);
    const genreRepository = dataSource.getRepository(Genre);
    const movieUserLikeRepository = dataSource.getRepository(MovieUserLike);

    // 테스트 데이터 넣기 전에 빈상태로 만들기
    await movieRepository.delete({});
    await movieDetailRepository.delete({});
    await userRepository.delete({});
    await directorRepository.delete({});
    await genreRepository.delete({});
    await movieUserLikeRepository.delete({});

    // 테스트 데이터 넣기
    users = [1, 2].map((x) =>
      userRepository.create({
        id: x,
        email: `${x}@test.com`,
        password: `123123`,
      }),
    );
    await userRepository.save(users);

    directors = [1, 2].map((x) =>
      directorRepository.create({
        id: x,
        dob: new Date('1992-11-23'),
        nationality: 'South Korea',
        name: `Director Name ${x}`,
      }),
    );
    await directorRepository.save(directors);

    genres = [1, 2].map((x) =>
      genreRepository.create({
        id: x,
        name: `Genre ${x}`,
      }),
    );
    await genreRepository.save(genres);

    movies = [1, 2, 3, 4, 5, 6, 7, 8, 9, 11, 12, 13, 14, 15].map((x) =>
      movieRepository.create({
        id: x,
        title: `Movie ${x}`,
        creator: users[0],
        genres: genres,
        likeCount: 0,
        dislikeCount: 0,
        detail: movieDetailRepository.create({
          detail: `Movie Detail ${x}`,
        }),
        movieFilePath: 'moves/movie1.mp4',
        director: directors[0],
        createdAt: new Date(`2023-9-${x}`),
      }),
    );
    await movieRepository.save(movies);

    // 인증용 토큰 생성
    let authService = moduleFixture.get<AuthService>(AuthService);
    token = await authService.issueToken(
      { id: users[0].id, role: Role.admin },
      false,
    );
  });

  afterAll(async () => {
    await new Promise((resolve) => setTimeout(resolve, 500)); // 바로 서버 닫으면 권고(노란) 로그가 뜨기 때문에 이를 방지하기 위해 기다렸다 닫음
    await dataSource.destroy(); // db 삭제
    await app.close(); // 서버 닫기
  });

  describe('[GET /Movie]', () => {
    it('should get all movies', async () => {
      const { body, statusCode } = await request(app.getHttpServer()) // 에러 보고 싶으면 {}에 error 추가하고 log 찍기
        .get('/movie');

      expect(statusCode).toBe(200);
      expect(body).toHaveProperty('data');
      expect(body).toHaveProperty('nextCursor');
      expect(body).toHaveProperty('count');

      expect(body.data).toHaveLength(5);
    });
  });

  describe('[GET /movie/recet]', () => {
    it('should get recent movies', async () => {
      const { body, statusCode } = await request(app.getHttpServer())
        .get('/movie/recent')
        .set('authorization', `Bearer ${token}`); // 인증용 토큰 넣기

      expect(statusCode).toBe(200);
      expect(body).toHaveLength(10);
    });
  });

  describe('[GET /movie/{id}', () => {
    it('should get movie by id', async () => {
      const movieId = movies[0].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .get(`/movie/${movieId}`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);
      expect(body.id).toBe(movieId);
    });

    it('should throw 404 error if movie does not exist', async () => {
      const movieId = 99999;

      const { body, statusCode } = await request(app.getHttpServer())
        .get(`/movie/${movieId}`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(404);
    });
  });

  describe('[POST /movie]', () => {
    it('should create movie', async () => {
      // movieFileName을 mock처리 해도 되고, 실제로 요청해서 받아와도 되고.
      const {
        body: { fileName },
      } = await request(app.getHttpServer())
        .post('/common/video')
        .set('authorization', `Bearer ${token}`)
        .attach('video', Buffer.from('test'), 'movie.mp4') // 가상의 파일 첨부
        .expect(201);

      const dto: CreateMovieDto = {
        title: 'Test Movie',
        detail: 'Test Movie Detail',
        directorId: directors[0].id,
        genreIds: genres.map((x) => x.id),
        movieFileName: fileName,
      };

      const { body, statusCode } = await request(app.getHttpServer())
        .post('/movie')
        .set('authorization', `Bearer ${token}`)
        .send(dto); // front에서 보내는 body 넣기

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
      expect(body.title).toBe(dto.title);
      expect(body.detail.detail).toBe(dto.detail);
      expect(body.director.id).toBe(dto.directorId);
      expect(body.genres.map((x) => x.id)).toEqual(dto.genreIds);
      expect(body.movieFilePath).toContain(fileName);

      // 파일 쌓이는거 방지하기 위해 파일 삭제 코드 추가함 (fs = File System)
      // import * as fs from 'fs/promises';
      await fs
        .unlink(`public/movie/${fileName}`)
        .catch((err) => console.error(`Error deleting file ${err}`));
    });
  });

  describe('[PATCH /movie/{id}', () => {
    it('should update movie if exists', async () => {
      const dto: UpdateMovieDto = {
        title: 'Updated Test Movie',
        detail: 'Updated Test Movie Detail',
        directorId: directors[0].id,
        genreIds: [genres[0].id],
      };

      const movieId = movies[0].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .patch(`/movie/${movieId}`)
        .set('authorization', `Bearer ${token}`)
        .send(dto);

      expect(statusCode).toBe(200);
      expect(body).toBeDefined();
      expect(body.title).toBe(dto.title);
      expect(body.detail.detail).toBe(dto.detail);
      expect(body.director.id).toBe(dto.directorId);
      expect(body.genres.map((x) => x.id)).toEqual(dto.genreIds);
    });
  });

  describe('[DELETE /movie/{id}', () => {
    it('should delete existing movie', async () => {
      const movieId = movies[0].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .delete(`/movie/${movieId}`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(200);
    });

    it('should throw 404 error if movie does not exist', async () => {
      const movieId = 99999;

      const { body, statusCode } = await request(app.getHttpServer())
        .delete(`/movie/${movieId}`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(404);
    });
  });

  describe('[POST /movie/{id}like]', () => {
    it('should like a movie', async () => {
      // beforAll로 데이터를 넣은 상태에서 실행중이기 때문에 db상태가 연동되어있는 중임.
      // 때문에 0번이 아닌 1번을 넣음.
      // beforeEach로 해야하지만 그러면 db 넣는 작업 계속 해서 오래걸리기 때문에 beforeAll을 함.
      const movieId = movies[1].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .post(`/movie/${movieId}/like`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
      expect(body.isLike).toBe(true);
    });

    it('should cancellike a movie', async () => {
      const movieId = movies[1].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .post(`/movie/${movieId}/like`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
      expect(body.isLike).toBe(null);
    });
  });

  describe('[POST /movie/{id}dislike]', () => {
    it('should dislike a movie', async () => {
      const movieId = movies[1].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .post(`/movie/${movieId}/dislike`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
      expect(body.isLike).toBe(false);
    });

    it('should canceldislike a movie', async () => {
      const movieId = movies[1].id;

      const { body, statusCode } = await request(app.getHttpServer())
        .post(`/movie/${movieId}/dislike`)
        .set('authorization', `Bearer ${token}`);

      expect(statusCode).toBe(201);
      expect(body).toBeDefined();
      expect(body.isLike).toBe(null);
    });
  });
});
