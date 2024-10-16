import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TasksModule } from './tasks/tasks.module';

@Module({
  imports: [
    TasksModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '12345678x@X',
      database: 'task-manager',
      autoLoadEntities: true,
      synchronize: true,
    }),
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class AppModule {}
