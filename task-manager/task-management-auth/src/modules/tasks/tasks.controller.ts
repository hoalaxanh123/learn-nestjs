import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskEntity } from './task.entity';
import { CreateTaskDto, SearchTaskDto } from './dto/tasks.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { AuthEntity } from '../auth/auth.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number, @GetUser() user: AuthEntity): Promise<TaskEntity> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/destroy')
  async deleteAllTasks(): Promise<string> {
    const affectedRows = await this.tasksService.deleteAllTasks();
    return `${affectedRows} task(s) deleted successfully`;
  }

  @Delete('/:taskId')
  async deleteTask(@Param('taskId', ParseIntPipe) taskId: number, @GetUser() user: AuthEntity): Promise<string> {
    await this.tasksService.deleteTask(taskId, user);
    return 'Task deleted successfully';
  }

  @Get()
  async searchTasks(@Query() searchTaskDto: SearchTaskDto, @GetUser() user: AuthEntity): Promise<TaskEntity[]> {
    if (Object.keys(searchTaskDto).length) {
      return this.tasksService.searchTasks(searchTaskDto, user);
    }
    return await this.tasksService.getAllTasksByUserId(user);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto, @GetUser() user: AuthEntity) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Put('/:id')
  updateTask(@Param('id', ParseIntPipe) id: number, @Body() updateTaskDto: CreateTaskDto, @GetUser() user: AuthEntity): Promise<TaskEntity> {
    return this.tasksService.updateTask(id, updateTaskDto, user);
  }

  @Post('/seed/:seedCount')
  async seedTasks(@Param('seedCount', ParseIntPipe) seedCount: number, @GetUser() user: AuthEntity): Promise<TaskEntity[]> {
    return await this.tasksService.seedTasks(seedCount, user);
  }
}
