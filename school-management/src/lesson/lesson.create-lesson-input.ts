import { Field, InputType } from '@nestjs/graphql';
import { IsOptional } from 'class-validator';

@InputType()
export class CreateLessonInput {
  @Field() name: string;

  // @isDateString()
  @Field() startDate: string;

  // @isDateString()
  @Field() endDate: string;

  @IsOptional() @Field(() => [String]) students: string[];
}
