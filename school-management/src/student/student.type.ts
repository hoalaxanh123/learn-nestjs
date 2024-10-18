import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType('Student')
export class StudentType {
  @Field((type) => ID) id: number;
  @Field() publicId: string;
  @Field() firstName: string;
  @Field() lastName: string;
}
