import { BadRequestException, ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { AuthEntity } from '../auth/auth.entity';
import { TasksRepository } from './task.repository';
import { PostgresErrorCodes } from '../../constants/postgres.error-codes';
import { DeleteResult } from 'typeorm';

@Injectable()
export class TasksService {
  private logger = new Logger('TasksService');

  constructor(private readonly taskRepository: TasksRepository) {}

  async createTask(createTaskDto: CreateTaskDto, user: AuthEntity): Promise<TaskEntity> {
    this.logger.log(`Creating a new task: ${JSON.stringify(createTaskDto)}`);
    try {
      return await this.taskRepository.createTask(createTaskDto, user);
    } catch (error) {
      if (error.code === PostgresErrorCodes.UNIQUE_VIOLATION) {
        this.logger.error(`Task with title '${createTaskDto.title}' already exists`);
        throw new ConflictException(`Task with title '${createTaskDto.title}' already exists`);
      }
      this.logger.error(`Error creating task: ${error}`);
      throw error as BadRequestException;
    }
  }

  async deleteTask(id: number, user: AuthEntity): Promise<void> {
    this.logger.log(`Deleting task with ID: ${id}`);
    const task = await this.getTaskById(id, user);
    const deleteResult: DeleteResult = await this.taskRepository.deleteTask(task);
    if (deleteResult.affected === 0) {
      this.logger.warn(`Trying to delete a ghost task with ID ${id}, ignoring...`);
    }
  }

  async deleteAllTasks(): Promise<number> {
    this.logger.log(`Deleting all tasks`);
    return await this.taskRepository.deleteAllTasks();
  }

  async updateTask(id: number, updateTaskDto: UpdateTaskDto, user: AuthEntity): Promise<TaskEntity> {
    this.logger.log(`Updating task with ID: ${id}`);
    const task = await this.getTaskById(id, user);
    return await this.taskRepository.updateTask(task, updateTaskDto);
  }

  async searchTasks(searchTaskDto: SearchTaskDto, user: AuthEntity): Promise<TaskEntity[]> {
    this.logger.log(`Searching tasks: ${JSON.stringify(searchTaskDto)}`);
    return await this.taskRepository.searchTasks(searchTaskDto, user);
  }

  async getTaskById(id: number, user: AuthEntity): Promise<TaskEntity> {
    this.logger.log(`Getting task with ID: ${id}`);
    const result = await this.taskRepository.getTaskById(id, user);
    if (!result) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return result;
  }

  async getAllTasksByUserId(user: AuthEntity): Promise<TaskEntity[]> {
    this.logger.log(`Getting all tasks for user: ${user.email}`);
    return await this.taskRepository.getAllTasksByUserId(user);
  }

  async seedTasks(numberOfNewTask: number, user: AuthEntity): Promise<TaskEntity[]> {
    return await this.taskRepository.seedTasks(numberOfNewTask, user);
  }
}
