import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { TaskEntity } from './task.entity';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { TaskStatus } from './task-status';

@Injectable()
export class TasksService {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  private taskRepository: DataSource<TaskEntity>;
  private logger = new Logger('TasksService');

  constructor(private dataSource: DataSource) {
    this.taskRepository = this.dataSource.getRepository(TaskEntity);
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    try {
      this.logger.log(
        `Creating task with data: ${JSON.stringify(createTaskDto)}`,
      );
      const task = await this.taskRepository.create(createTaskDto);
      const result = await this.taskRepository.save(task);
      this.logger.log(`Task created successfully`);
      return result;
    } catch (error) {
      if (error.code === '23505') {
        this.logger.error(
          `Task with title '${createTaskDto.title}' already exists`,
        );
        throw new ConflictException(
          `Task with title '${createTaskDto.title}' already exists`,
        );
      }
      this.logger.error(`Error creating task: ${error}`);
      throw error as BadRequestException;
    }
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRepository.delete({ id });
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async deleteAllTasks(): Promise<number> {
    const result = await this.taskRepository.delete({});
    this.logger.log(`Deleted ${result.affected} tasks`);

    this.logger.log(`Resetting sequence...`);
    await this.taskRepository.query(
      `ALTER SEQUENCE task_id_seq RESTART WITH 1`,
    );
    return result.affected;
  }

  async getTasks(): Promise<TaskEntity[]> {
    return this.taskRepository.find();
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const result = await this.taskRepository.findOneBy({ id });
    if (result.length === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
    return result;
  }

  async updateTask(
    id: number,
    updateTaskDto: UpdateTaskDto,
  ): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    await this.taskRepository.save(task);
    return task;
  }

  searchTasks(searchTaskDto: SearchTaskDto): TaskEntity[] {
    const { keyword, status } = searchTaskDto;
    let query = this.taskRepository.createQueryBuilder('task');
    if (status) {
      query = query.andWhere('task.status = :status', { status });
    }
    if (keyword) {
      query = query.andWhere(
        '(task.title LIKE :keyword OR task.description LIKE :keyword)',
        { keyword: `%${keyword}%` },
      );
    }
    return query.getMany();
  }

  async seedTasks(numberOfNewTask: number): Promise<TaskEntity[]> {
    const tasks: TaskEntity[] = [];
    for (let i = 0; i < numberOfNewTask; i++) {
      const task = new TaskEntity();
      task.title = `Task ${i + 1}`;
      task.description = `Description for Task ${i + 1}`;
      task.status = Math.random() > 0.5 ? TaskStatus.OPEN : TaskStatus.DONE;
      await this.taskRepository.save(task);
      tasks.push(task);
    }
    return tasks;
  }
}
