import { Field, InputType } from '@nestjs/graphql';
import { isDateString, MinLength } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @MinLength(5) @Field() name: string;

  // @isDateString()
  @Field() startDate: string;

  // @isDateString()
  @Field() endDate: string;
}
