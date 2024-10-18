import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Lesson')
export class LessonType {
  @Field(() => ID) id: number;

  @Field() name: string;

  @Field() startDate: string;

  @Field() endDate: string;

  @Field(() => [String]) students: string[];
}
