import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './task.entity';
import { CreateTaskDto, SearchTaskDto } from './dto/tasks.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/destroy')
  async deleteAllTasks(): Promise<string> {
    const affectedRows = await this.tasksService.deleteAllTasks();
    return `${affectedRows} task(s) deleted successfully`;
  }

  @Delete('/:taskId')
  async deleteTask(
    @Param('taskId', ParseIntPipe) taskId: number,
  ): Promise<string> {
    await this.tasksService.deleteTask(taskId);
    return 'Task deleted successfully';
  }

  @Get()
  async searchTasks(
    @Query() searchTaskDto: SearchTaskDto,
  ): Promise<TaskEntity[]> {
    if (Object.keys(searchTaskDto).length) {
      return this.tasksService.searchTasks(searchTaskDto);
    }
    return await this.tasksService.getTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put('/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: CreateTaskDto,
  ): Promise<TaskEntity> {
    return this.tasksService.updateTask(id, updateTaskDto);
  }
}
