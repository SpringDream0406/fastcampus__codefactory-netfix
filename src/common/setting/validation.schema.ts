import * as Joi from 'joi';

const requiredString = Joi.string().required();
const requiredNumber = Joi.number().required();

export const validationSchema = Joi.object({
  ENV: Joi.string().valid('test', 'dev', 'prod').required(),
  DB_TYPE: Joi.string().valid('postgres').required(),
  DB_HOST: requiredString,
  DB_PORT: requiredNumber,
  DB_USERNAME: requiredString,
  DB_PASSWORD: Joi.required(),
  DATABASE: requiredString,
  HASH_ROUNDS: requiredNumber,
  ACCESS_TOKEN_SECRET: requiredString,
  REFRESH_TOKEN_SECRET: requiredString,
});
