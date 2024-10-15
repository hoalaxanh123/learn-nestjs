import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [TasksModule, TypeOrmModule, AuthModule],
})
export class AppModule {}
