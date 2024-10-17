import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { CreateLessonInput } from './lesson.create-lesson-input';

@Injectable()
export class LessonService {
  constructor(
    @InjectRepository(Lesson) private lessonRepository: Repository<Lesson>,
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
    const { name, startDate, endDate } = createLessonInput;
    const lesson = this.lessonRepository.create({
      publicId: uuid(),
      name,
      startDate,
      endDate,
    });
    return this.lessonRepository.save(lesson);
  }

  async getAllLessons(): Promise<Lesson[]> {
    const result = (await this.lessonRepository.find()) || [];
    if (!result) {
      throw new NotFoundException(`No Lesson found`);
    }
    return result;
  }
}
