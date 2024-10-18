import { Module } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson.entity';
import { LessonResolver } from './lesson.resolver';
import { StudentModule } from '../student/student.module';

@Module({
  imports: [TypeOrmModule.forFeature([Lesson]), StudentModule],
  controllers: [],
  providers: [LessonResolver, LessonService],
})
export class LessonModule {}
