import { ValidationArguments } from 'class-validator';
import { createCustomValidator } from './helper';

// Create the custom validators using the helper function
export const IsAlphaNumeric = createCustomValidator(
  'isAlphaNumeric',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (value: any, args: ValidationArguments) =>
    typeof value === 'string' && /^[a-zA-Z0-9\s]+$/.test(value),
  (args: ValidationArguments) =>
    `${args.property} must contain only space, letters and numbers.`,
);

export const IsUppercase = createCustomValidator(
  'isUppercase',
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  (value: any, args: ValidationArguments) =>
    typeof value === 'string' && value === value.toUpperCase(),
  (args: ValidationArguments) => `${args.property} must be uppercase.`,
);
