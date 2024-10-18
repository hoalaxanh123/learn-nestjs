// Create a new entity called Student
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Student {
  @ObjectIdColumn() _id: string;

  @PrimaryColumn() publicId: string;

  @Column() firstName: string;

  @Column() lastName: string;
}
