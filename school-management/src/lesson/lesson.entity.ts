// Create a mongodb Lesson entity in src/lesson/lesson.entity.ts:
import { Column, Entity, ObjectIdColumn, PrimaryColumn } from 'typeorm';

@Entity()
export class Lesson {
  @ObjectIdColumn() _id: string;

  @PrimaryColumn() publicId: string;

  @Column() name: string;

  @Column() startDate: string;

  @Column() endDate: string;
}
