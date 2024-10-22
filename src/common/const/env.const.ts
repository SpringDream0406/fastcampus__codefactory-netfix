import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export enum envKeys {
  env = 'ENV',
  dbType = 'DB_TYPE',
  dbHost = 'DB_HOST',
  dbPort = 'DB_PORT',
  dbUsername = 'DB_USERNAME',
  dbPassword = 'DB_PASSWORD',
  dbDatabase = 'DATABASE',
  hasRounds = 'HASH_ROUNDS',
  accessTokenSecret = 'ACCESS_TOKEN_SECRET',
  refreshTokenSecret = 'REFRESH_TOKEN_SECRET',
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request ...');
    next();
  }
}
