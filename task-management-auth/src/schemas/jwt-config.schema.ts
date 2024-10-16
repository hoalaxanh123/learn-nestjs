// Use @hapi/joi to validate the TypeORM configuration
import * as Joi from 'joi';

export const jwtConfigValidationSchema = Joi.object({
  JWT_EXPIRATION: Joi.number().default(3600),
  JWT_EXPIRATION_TIME: Joi.string().default('1h'),
  SALT_ROUNDS: Joi.number().default(10),
});
