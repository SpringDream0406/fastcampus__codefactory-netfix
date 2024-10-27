import {
  ClassSerializerInterceptor,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DirectorModule } from './director/director.module';
import { GenreModule } from './genre/genre.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { BearerTokenMiddleware } from './auth/middleware/bearer-token.middleware';
import { AuthGuard } from './auth/guard/auth.guard';
import { RBACGuard } from './auth/guard/rbac.guard';
import { MovieModule } from './movie/movie.module';
import { ResponseTimeInterceptor } from './common/interceptor/response-time.interceptor';
import { ForbiddenExceptionFilter } from './common/filter/forbidden.filter';
import { QueryFailedExceptionFilter } from './common/filter/query-failed.filter';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottleInterceptor } from './common/interceptor/throttle.interceptor';
import { ScheduleModule } from '@nestjs/schedule';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { validationSchema } from './common/setting/validation.schema';
import { databaseConfig } from './common/setting/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: validationSchema,
    }),
    TypeOrmModule.forRootAsync(databaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'public'),
      serveRoot: '/public/',
    }),
    CacheModule.register({
      ttl: 0,
      isGlobal: true,
    }),
    // WinstonModule.forRoot({
    //   level: 'debug',
    //   transports: [
    //     new winston.transports.Console({
    //       format: winston.format.combine(
    //         winston.format.colorize({
    //           all: true,
    //         }),
    //         winston.format.timestamp(),
    //         winston.format.printf(
    //           (info) =>
    //             `[${info.context}] ${info.timestamp} ${info.level} ${info.message}`,
    //         ),
    //       ),
    //     }),
    //     new winston.transports.File({
    //       dirname: join(process.cwd(), 'logs'),
    //       filename: 'logs.log',
    //       format: winston.format.combine(
    //         // winston.format.colorize({
    //         //   all: true,
    //         // }),
    //         winston.format.timestamp(),
    //         winston.format.printf(
    //           (info) =>
    //             `[${info.context}] ${info.timestamp} ${info.level} ${info.message}`,
    //         ),
    //       ),
    //     }),
    //   ],
    // }),
    ScheduleModule.forRoot(),
    DirectorModule,
    GenreModule,
    AuthModule,
    UserModule,
    MovieModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RBACGuard,
    },
    { provide: APP_INTERCEPTOR, useClass: ResponseTimeInterceptor },
    // {
    //   provide: APP_FILTER,
    //   useClass: ForbiddenExceptionFilter,
    // },
    {
      provide: APP_FILTER,
      useClass: QueryFailedExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ThrottleInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(BearerTokenMiddleware)
      .exclude(
        {
          path: 'auth/login',
          method: RequestMethod.POST,
        },
        { path: 'auth/register', method: RequestMethod.POST },
      )
      .forRoutes('*');
  }
}
