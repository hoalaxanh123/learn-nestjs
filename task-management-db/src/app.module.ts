import { Module } from '@nestjs/common';
import { TasksController } from './tasks/tasks.controller';
import { TasksService } from './tasks/tasks.service';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from './datasource/typeorm.module';

@Module({
  imports: [TasksModule, TypeOrmModule],
  controllers: [TasksController],
  providers: [TasksService],
})
export class AppModule {}
