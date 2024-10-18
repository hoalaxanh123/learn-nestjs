import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.create-lesson-input';
import { StudentService } from '../student/student.service';
import { Student } from '../student/student.entity';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
    private studentService: StudentService,
  ) {}

  async getLessonById(id: string): Promise<Lesson> {
    // return the lesson with the given id if it matches the publicId or objectId

    const lesson = await this.lessonRepository.findOneBy({ publicId: id });
    if (!lesson) {
      throw new NotFoundException(`Lesson with id ${id} is cannot be found !`);
    }
    return lesson;
  }

  async createLesson(createLessonInput: CreateLessonInput): Promise<Lesson> {
    const { name, startDate, endDate, students } = createLessonInput;
    if (students) {
      await this.studentService.getStudentsByIds(students);
    }
    const lesson = this.lessonRepository.create({
      publicId: uuid(),
      name,
      startDate,
      endDate,
      students: students || [],
    });
    return this.lessonRepository.save(lesson);
  }

  async getAllLessons(): Promise<Lesson[]> {
    return (await this.lessonRepository.find()) || [];
  }

  async assignStudentsToLesson(
    lessonId: string,
    studentIds: string[],
  ): Promise<Lesson> {
    const lesson = await this.getLessonById(lessonId);
    await this.studentService.getStudentsByIds(studentIds);
    const newStudentIds = [...(lesson.students || []), ...studentIds];
    lesson.students = [...new Set(newStudentIds)];
    return this.lessonRepository.save(lesson);
  }

  async getStudentsByIds(
    studentIds: string[],
    doubleCheck: boolean = false,
  ): Promise<Student[]> {
    // Get all student in the array of ids
    return await this.studentService.getStudentsByIds(studentIds, doubleCheck);
  }
}
