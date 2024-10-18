import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { LessonModule } from './lesson/lesson.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lesson } from './lesson/lesson.entity';
import { StudentModule } from './student/student.module';
import { Student } from './student/student.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mongodb', // By default, mongodb will connect via account admin, we are running mongodb in docker container as root user, so we need to specify the authSource
      url: 'mongodb://root:12345678@localhost:27017/school?authSource=admin',
      entities: [Lesson, Student],
      logging: 'all',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    LessonModule,
    StudentModule,
  ],
})
export class AppModule {}
