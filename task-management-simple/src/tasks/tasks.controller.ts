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
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto, UpdateTaskStatusDto } from "./dto/tasks.dto";
import { Task, TaskStatus } from './task.model';

@Controller('tasks')
export class TasksController {
  private tasksService: TasksService = new TasksService();

  @Get()
  getTasks(@Query() searchTaskDto: SearchTaskDto): Task[] {
    return searchTaskDto?.keyword || searchTaskDto?.status
      ? this.tasksService.searchTasks(searchTaskDto)
      : this.tasksService.getTasks();
  }

  @Get('/:id')
  getTaskById(@Param('id', ParseIntPipe) id: number): Task {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:taskId')
  deleteTask(@Param('id', ParseIntPipe) taskId: number): Task | string {
    this.tasksService.deleteTask(taskId);
    return 'Task deleted successfully';
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.createTask(createTaskDto);
  }

  @Put('/:id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Task {
    return this.tasksService.updateTask(id, updateTaskDto);
  }

  @Put('/:id/:status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') updateTaskStatusDto: UpdateTaskStatusDto,
  ): Task {
    const { status } = updateTaskStatusDto;
    return this.tasksService.updateTaskStatus(id, status);
  }
}
