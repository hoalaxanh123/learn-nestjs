import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from '../tasks.service';
import { TasksRepository } from '../task.repository';
import { AuthEntity } from '../../auth/auth.entity';
import { TaskEntity } from '../task.entity';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from '../dto/tasks.dto';
import { TaskStatus } from '../task-status';
import { NotFoundException } from '@nestjs/common';

describe('Tasks Service', () => {
  let service: TasksService;

  // @ts-ignore
  const mockTaskRepository: jest.Mocked<TasksRepository> = {
    createTask: jest.fn(),
    deleteTask: jest.fn(),
    deleteAllTasks: jest.fn(),
    updateTask: jest.fn(),
    searchTasks: jest.fn(),
    getTaskById: jest.fn(),
    getAllTasksByUserId: jest.fn(),
    seedTasks: jest.fn(),
  };

  const createTaskDto: CreateTaskDto = {
    title: 'Test Task',
    description: 'Test Description',
    status: TaskStatus.OPEN,
  };
  const mockUser: AuthEntity = {
    id: 1,
    email: 'test@example.com',
  } as AuthEntity;
  const mockTask: TaskEntity = { id: 1, title: 'Test Task' } as TaskEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TasksService, { provide: TasksRepository, useValue: mockTaskRepository }],
    }).compile();

    service = module.get<TasksService>(TasksService);
  });

  it('Service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a task successfully', async () => {
    const createTaskDto: CreateTaskDto = {
      title: 'Test Task',
      description: 'Test Description',
      status: TaskStatus.OPEN,
    };
    mockTaskRepository.createTask.mockResolvedValue(mockTask);

    const result = await service.createTask(createTaskDto, mockUser);
    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
  });

  it('Should delete a task successfully', async () => {
    mockTaskRepository.deleteTask.mockResolvedValue(undefined);
    await service.deleteTask(1, mockUser);
    expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(1, mockUser);
  });

  it('Delete task should not throw error if task not found', async () => {
    mockTaskRepository.deleteTask.mockResolvedValue(null);
    await expect(service.deleteTask(1, mockUser)).resolves.not.toThrow();
    expect(mockTaskRepository.deleteTask).toHaveBeenCalledWith(1, mockUser);
  });

  it('Should delete all tasks successfully', async () => {
    mockTaskRepository.deleteAllTasks.mockResolvedValue(1);
    const result = await service.deleteAllTasks();
    expect(result).toEqual(1);
    expect(mockTaskRepository.deleteAllTasks).toHaveBeenCalled();
  });

  it('Should update a task successfully', async () => {
    const updateTaskDto: UpdateTaskDto = {
      ...createTaskDto,
      title: 'Updated Task',
    };
    mockTaskRepository.updateTask.mockResolvedValue(mockTask);

    const result = await service.updateTask(1, updateTaskDto, mockUser);
    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(1, updateTaskDto, mockUser);
  });

  it('Should update a task throw error if task not found', async () => {
    const updateTaskDto: UpdateTaskDto = {
      ...createTaskDto,
      title: 'Updated Task',
    };

    mockTaskRepository.updateTask.mockImplementation(() => {
      throw new NotFoundException();
    });

    await expect(service.updateTask(1, updateTaskDto, mockUser)).rejects.toThrow(NotFoundException);
    expect(mockTaskRepository.updateTask).toHaveBeenCalledWith(1, updateTaskDto, mockUser);
  });

  it('Should search tasks with keyword successfully', async () => {
    const searchTaskDto: SearchTaskDto = { keyword: 'Test' };
    mockTaskRepository.searchTasks.mockResolvedValue([mockTask]);

    const result = await service.searchTasks(searchTaskDto, mockUser);
    expect(result).toEqual([mockTask]);
    expect(mockTaskRepository.searchTasks).toHaveBeenCalledWith(searchTaskDto, mockUser);
  });

  it('Should search tasks with status successfully', async () => {
    const searchTaskDto: SearchTaskDto = { status: TaskStatus.OPEN };
    mockTaskRepository.searchTasks.mockResolvedValue([mockTask]);

    const result = await service.searchTasks(searchTaskDto, mockUser);
    expect(result).toEqual([mockTask]);
    expect(mockTaskRepository.searchTasks).toHaveBeenCalledWith(searchTaskDto, mockUser);
  });

  it('Should search tasks with both keyword and status successfully', async () => {
    const searchTaskDto: SearchTaskDto = {
      status: TaskStatus.OPEN,
      keyword: 'Test',
    };
    mockTaskRepository.searchTasks.mockResolvedValue([mockTask]);

    const result = await service.searchTasks(searchTaskDto, mockUser);
    expect(result).toEqual([mockTask]);
    expect(mockTaskRepository.searchTasks).toHaveBeenCalledWith(searchTaskDto, mockUser);
  });

  it('Should get a task by id successfully', async () => {
    mockTaskRepository.getTaskById.mockResolvedValue(mockTask);

    const result = await service.getTaskById(1, mockUser);
    expect(result).toEqual(mockTask);
    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1, mockUser);
  });

  it('Should get a task by id throw error if task not found', async () => {
    // Mock mockTaskRepository.getTaskById to throw NotFoundException
    mockTaskRepository.getTaskById.mockImplementation(() => {
      throw new NotFoundException();
    });
    // Write test to check the expect function (service.getTaskById(1, mockUser) should throw NotFoundException too
    await expect(service.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);

    expect(mockTaskRepository.getTaskById).toHaveBeenCalledWith(1, mockUser);
  });

  it('Should get all tasks by user id successfully', async () => {
    mockTaskRepository.getAllTasksByUserId.mockResolvedValue([mockTask]);

    const result = await service.getAllTasksByUserId(mockUser);
    expect(result).toEqual([mockTask]);
    expect(mockTaskRepository.getAllTasksByUserId).toHaveBeenCalledWith(mockUser);
  });

  it('Should seed tasks successfully', async () => {
    mockTaskRepository.seedTasks.mockResolvedValue([mockTask]);

    const result = await service.seedTasks(1, mockUser);
    expect(result).toEqual([mockTask]);
    expect(mockTaskRepository.seedTasks).toHaveBeenCalledWith(1, mockUser);
  });
});
