import { TaskStatus } from '../task-status';
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

export class UpdateTaskDto extends CreateTaskDto {}

export class SearchTaskDto {
  @IsOptional()
  @IsNotEmpty()
  keyword?: string;

  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class UpdateTaskStatusDto {
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
