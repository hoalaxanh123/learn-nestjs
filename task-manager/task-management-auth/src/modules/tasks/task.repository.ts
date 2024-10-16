import { Injectable, Logger } from '@nestjs/common';
import { TaskEntity } from './task.entity';
import { DataSource, DeleteResult, Repository } from 'typeorm';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { AuthEntity } from '../auth/auth.entity';
import { TaskStatus } from './task-status';

@Injectable()
export class TasksRepository extends Repository<TaskEntity> {
  private logger: Logger = new Logger('TasksRepository');

  constructor(private dataSource: DataSource) {
    super(TaskEntity, dataSource.createEntityManager());
  }

  async createTask(createTaskDto: CreateTaskDto, user: AuthEntity): Promise<TaskEntity> {
    this.logger.log(`Creating task with data: ${JSON.stringify(createTaskDto)}`);
    const task = this.create({ ...createTaskDto, user });
    const result = await this.save(task);
    this.logger.log(`Task created successfully`);
    return result;
  }

  async searchTasks(searchTaskDto: SearchTaskDto, user: AuthEntity): Promise<TaskEntity[]> {
    const { keyword, status } = searchTaskDto;
    let query = this.createQueryBuilder('task');
    query = query.where('task.userId = :userId', { userId: user.id });
    if (status) {
      query = query.andWhere('task.status = :status', { status });
    }
    if (keyword) {
      query = query.andWhere('(task.title LIKE :keyword OR task.description LIKE :keyword)', { keyword: `%${keyword}%` });
    }
    return query.getMany();
  }

  async getAllTasksByUserId(user: AuthEntity): Promise<TaskEntity[]> {
    return await this.find({
      relations: { user: true },
      where: {
        user: { id: user.id },
      },
    });
  }

  async seedTasks(numberOfNewTask: number, user: AuthEntity): Promise<TaskEntity[]> {
    const tasks: TaskEntity[] = [];
    for (let i = 0; i < numberOfNewTask; i++) {
      const task = new TaskEntity();
      task.title = `Task ${i + 1}`;
      task.description = `Description for Task ${i + 1}`;
      task.status = Math.random() > 0.5 ? TaskStatus.OPEN : TaskStatus.DONE;
      task.user = user;
      await this.save(task);
      tasks.push(task);
    }
    return tasks;
  }

  async getTaskById(id: number, user: AuthEntity): Promise<TaskEntity> {
    return await this.findOne({
      relations: { user: true },
      where: {
        user: { id: user.id },
        id,
      },
    });
  }

  async updateTask(task: TaskEntity, updateTaskDto: UpdateTaskDto): Promise<TaskEntity> {
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    await this.save(task);
    return task;
  }

  async deleteAllTasks(): Promise<number> {
    const result = await this.delete({});
    this.logger.log(`Deleted ${result.affected} tasks`);

    this.logger.log(`Resetting sequence...`);
    await this.query(`ALTER SEQUENCE task_id_seq RESTART WITH 1`);
    return result.affected;
  }

  async deleteTask(task: TaskEntity): Promise<DeleteResult> {
    return await this.delete(task);
  }
}
