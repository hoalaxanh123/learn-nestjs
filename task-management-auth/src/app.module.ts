import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { TypeOrmModule } from './datasource/typeorm.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { typeOrmConfigValidationSchema } from './schemas/config.schema';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `src/dotenv/.env.${process.env.STAGE}`,
      validationSchema: typeOrmConfigValidationSchema,
    }),
    TasksModule,
    TypeOrmModule,
    AuthModule,
  ],
})
export class AppModule {}
