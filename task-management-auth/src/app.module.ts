import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/dotenv/.env.${process.env.STAGE}`,
    }),
    TasksModule,
    TypeOrmModule,
    AuthModule,
  ],
})
export class AppModule {}
