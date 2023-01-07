import type { ClassConstructor } from 'class-transformer';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ name: 'Match' })
export class MatchConstraint implements ValidatorConstraintInterface {
  validate(value: unknown, args: ValidationArguments) {
    const [fn] = args.constraints;

    return fn(args.object) === value;
  }

  defaultMessage(args: ValidationArguments) {
    const [constraintProperty]: Array<() => unknown> = args.constraints;

    return `${constraintProperty} and ${args.property} does not match`;
  }
}

export function Match<T>(
  type: ClassConstructor<T>,
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  property: (o: T) => any,
  validationOptions?: ValidationOptions,
) {
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MatchConstraint,
    });
  };
}
