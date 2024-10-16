// Use @hapi/joi to validate the TypeORM configuration
import * as Joi from 'joi';

export const typeOrmConfigValidationSchema = Joi.object({
  STAGE: Joi.string().valid('dev', 'prod', 'test').required(),
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().required(),
  DB_USERNAME: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_LOGGING: Joi.string().required(),
  DB_SYNCHRONIZE: Joi.string().required(),
});
