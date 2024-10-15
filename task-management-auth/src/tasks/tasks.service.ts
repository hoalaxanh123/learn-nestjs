import { Injectable, Logger } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { AuthEntity } from '../auth/auth.entity';
import { TasksRepository } from './task.repository';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');

  constructor(private readonly taskRepository: TasksRepository) {}

  async createTask(
    createTaskDto: CreateTaskDto,
    user: AuthEntity,
  ): Promise<TaskEntity> {
    this.logger.log(`Creating a new task: ${JSON.stringify(createTaskDto)}`);
    return await this.taskRepository.createTask(createTaskDto, user);
  }

  async deleteTask(id: number, user: AuthEntity): Promise<void> {
    this.logger.log(`Deleting task with ID: ${id}`);
    await this.taskRepository.deleteTask(id, user);
  }

  async deleteAllTasks(): Promise<number> {
    this.logger.log(`Deleting all tasks`);
    return await this.taskRepository.deleteAllTasks();
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
    user: AuthEntity,
  ): Promise<TaskEntity> {
    this.logger.log(`Updating task with ID: ${id}`);
    return await this.taskRepository.updateTask(id, updateTaskDto, user);
  }

  async searchTasks(
    searchTaskDto: SearchTaskDto,
    user: AuthEntity,
  ): Promise<TaskEntity[]> {
    this.logger.log(`Searching tasks: ${JSON.stringify(searchTaskDto)}`);
    return await this.taskRepository.searchTasks(searchTaskDto, user);
  }

  async getTaskById(id: number, user: AuthEntity): Promise<TaskEntity> {
    this.logger.log(`Getting task with ID: ${id}`);
    return await this.taskRepository.getTaskById(id, user);
  }

  async getAllTasksByUserId(user: AuthEntity): Promise<TaskEntity[]> {
    this.logger.log(`Getting all tasks for user: ${user.email}`);
    return await this.taskRepository.getAllTasksByUserId(user);
  }

  async seedTasks(
    numberOfNewTask: number,
    user: AuthEntity,
  ): Promise<TaskEntity[]> {
    return await this.taskRepository.seedTasks(numberOfNewTask, user);
  }
}
