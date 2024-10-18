import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { LessonType } from './lesson.type';
import { LessonService } from './lesson.service';
import { CreateLessonInput } from './lesson.create-lesson-input';

@Resolver(() => LessonType)
export class LessonResolver {
  constructor(private readonly lessonService: LessonService) {}

  @Query(() => LessonType) lesson(@Args('id') id: string) {
    return this.lessonService.getLessonById(id);
  }

  @Query(() => [LessonType]) lessons() {
    return this.lessonService.getAllLessons();
  }

  @Mutation(() => LessonType) createLesson(
    @Args('createLessonInput') createLessonInput: CreateLessonInput,
  ) {
    return this.lessonService.createLesson(createLessonInput);
  }

  @Mutation(() => LessonType) assignStudentsToLesson(
    @Args('lessonId') lessonId: string,
    @Args({ name: 'studentIds', type: () => [String] }) studentIds: string[],
  ) {
    return this.lessonService.assignStudentsToLesson(lessonId, studentIds);
  }
}
