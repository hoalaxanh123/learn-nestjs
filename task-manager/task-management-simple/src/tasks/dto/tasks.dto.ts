import { TaskStatus } from '../task.model';
import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUppercase, Matches, ValidateIf } from "class-validator";
import { IsAlphaNumeric } from "../../custom-validator";

export class CreateTaskDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  description: string;
}

export class UpdateTaskDto {
  @IsAlphaNumeric()
  title: string;
  @IsNotEmpty()
  description: string;
  @IsEnum(TaskStatus)
  status: TaskStatus;
}

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
