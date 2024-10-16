// Helper function to create custom validation decorators
import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export const createCustomValidator = (name: string, validateFn: (value: any, args: ValidationArguments) => boolean, defaultMessageFn: (args: ValidationArguments) => string) => {
  return function (validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
      registerDecorator({
        name,
        target: object.constructor,
        propertyName,
        options: validationOptions,
        validator: {
          validate: validateFn,
          defaultMessage: defaultMessageFn,
        },
      });
    };
  };
};
