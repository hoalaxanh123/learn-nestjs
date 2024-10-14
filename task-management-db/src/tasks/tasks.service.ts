import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from './dto/tasks.dto';
import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from './task.model';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: 1,
      title: 'Task 1',
      description: 'Task 1 Description',
      status: TaskStatus.OPEN,
    },
    {
      id: 2,
      title: 'Task 2',
      description: 'Task 2 Description',
      status: TaskStatus.IN_PROGRESS,
    },
    {
      id: 3,
      title: 'Task 3',
      description: 'Task 3 Description',
      status: TaskStatus.DONE,
    },
    {
      id: 4,
      title: 'Task 4',
      description: 'Task 4 Description',
      status: TaskStatus.OPEN,
    },
  ];

  getTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTask: CreateTaskDto): Task {
    const { title, description } = createTask;
    const newTask = new Task(this.tasks.length + 1, title, description);
    this.tasks.push(newTask);
    return newTask;
  }

  getTaskById(id: number): Task {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task id '${id}' not found`);
    }
    return task;
  }

  deleteTask(taskId: number): Task {
    const task = this.getTaskById(taskId);
    this.tasks = this.tasks.filter(
      (checkingTask) => checkingTask.id !== task.id,
    );
    return task;
  }

  updateTask(id: number, updateTaskDto: UpdateTaskDto) {
    const task = this.getTaskById(id);
    task.title = updateTaskDto.title;
    task.description = updateTaskDto.description;
    task.status = updateTaskDto.status;
    return task;
  }

  updateTaskStatus(id: number, newStatus: TaskStatus) {
    const task = this.getTaskById(id);
    if (!task) {
      return null;
    }
    task.status = newStatus;
    return task;
  }

  searchTasks(searchTaskDto: SearchTaskDto): Task[] {
    const { keyword, status } = searchTaskDto;
    let result = this.tasks;
    if (status) {
      result = result.filter((task) => task.status === status);
    }
    if (keyword) {
      result = result.filter(
        (task) =>
          task.title.toUpperCase().includes(keyword.toUpperCase()) ||
          task.description.toUpperCase().includes(keyword.toUpperCase()),
      );
    }
    return result;
  }
}
