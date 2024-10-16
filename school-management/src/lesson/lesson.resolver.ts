import { Args, Query, Resolver } from '@nestjs/graphql';
import { LessonType } from './lesson.type';


@Resolver(of => LessonType)
export class LessonResolver {
  // constructor(private readonly lessonService: LessonService) {
  // }

  @Query(returns => LessonType) lesson() {
    // return this.lessonService.getLessonById(id);
    return {
      id: 1, name: 'Physics Class', startDate: '2021-01-01', endDate: '2021-02-01',
    };
  }
}