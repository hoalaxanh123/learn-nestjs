import { Test, TestingModule } from '@nestjs/testing';
import { TasksRepository } from '../task.repository';
import { DataSource } from 'typeorm';
import { TaskEntity } from '../task.entity';
import { AuthEntity } from '../../auth/auth.entity';
import { CreateTaskDto, SearchTaskDto, UpdateTaskDto } from '../dto/tasks.dto';
import { TaskStatus } from '../task-status';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';

describe('TasksRepository', () => {
  let tasksRepository: TasksRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksRepository,
        {
          provide: DataSource,
          useValue: {
            createEntityManager: jest.fn(),
          },
        },
      ],
    }).compile();

    tasksRepository = module.get<TasksRepository>(TasksRepository);
  });

  it('should be defined', () => {
    expect(tasksRepository).toBeDefined();
  });

  describe('createTask', () => {
    it('should create a task successfully', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
      };
      const mockTask: TaskEntity = {
        id: 1,
        ...createTaskDto,
        user: mockUser,
      } as TaskEntity;
      // @ts-ignore
      tasksRepository.create = jest.fn().mockReturnValue(mockTask);
      // @ts-ignore
      tasksRepository.save = jest.fn().mockResolvedValue(mockTask);

      const result = await tasksRepository.createTask(createTaskDto, mockUser);
      expect(result).toEqual(mockTask);
      // @ts-ignore
      expect(tasksRepository.create).toHaveBeenCalledWith({
        ...createTaskDto,
        user: mockUser,
      });
      // @ts-ignore
      expect(tasksRepository.save).toHaveBeenCalledWith(mockTask);
    });

    it('should throw ConflictException if task with the same title already exists', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
      };
      // @ts-ignore
      tasksRepository.create = jest.fn().mockReturnValue(createTaskDto);
      // @ts-ignore
      tasksRepository.save = jest.fn().mockRejectedValue({
        code: '23505',
      });

      await expect(tasksRepository.createTask(createTaskDto, mockUser)).rejects.toThrowError(ConflictException);
    });

    it('should throw BadRequestException for other errors', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const createTaskDto: CreateTaskDto = {
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
      };
      // @ts-ignore
      tasksRepository.create = jest.fn().mockReturnValue(createTaskDto);
      // @ts-ignore
      tasksRepository.save = jest.fn().mockRejectedValue(new Error());

      await expect(tasksRepository.createTask(createTaskDto, mockUser)).rejects.toThrowError(BadRequestException);
    });
  });

  describe('searchTasks', () => {
    it('should return an empty array if no tasks are found', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const searchTaskDto: SearchTaskDto = {
        status: TaskStatus.OPEN,
        keyword: 'Test',
      };
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([]),
      };
      // @ts-ignore
      tasksRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);
      const result = await tasksRepository.searchTasks(searchTaskDto, mockUser);
      expect(result).toEqual([]);
    });

    it('should return tasks that match the search criteria', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const searchTaskDto: SearchTaskDto = {
        status: TaskStatus.OPEN,
        keyword: 'Test',
      };
      const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        user: mockUser,
      } as TaskEntity;
      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([mockTask]),
      };
      // @ts-ignore
      tasksRepository.createQueryBuilder = jest.fn().mockReturnValue(mockQueryBuilder);
      const result = await tasksRepository.searchTasks(searchTaskDto, mockUser);
      expect(result).toEqual([mockTask]);
    });
  });

  describe('getAllTasksByUserId', () => {
    it('should return all tasks for the given user id', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        user: mockUser,
      } as TaskEntity;
      // @ts-ignore
      tasksRepository.find = jest.fn().mockResolvedValue([mockTask]);
      const result = await tasksRepository.getAllTasksByUserId(mockUser);
      expect(result).toEqual([mockTask]);
      // @ts-ignore
      expect(tasksRepository.find).toHaveBeenCalledWith({
        relations: { user: true },
        where: {
          user: { id: mockUser.id },
        },
      });
    });
  });

  describe('seedTasks', () => {
    it('should seed the specified number of tasks for the given user', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const numberOfNewTask = 5;
      // @ts-ignore
      tasksRepository.save = jest.fn().mockResolvedValue({});
      const result = await tasksRepository.seedTasks(numberOfNewTask, mockUser);
      expect(result).toHaveLength(numberOfNewTask);
      expect(result[0].title).toEqual('Task 1');
      // @ts-ignore
      expect(tasksRepository.save).toHaveBeenCalledTimes(numberOfNewTask);
    });
  });

  describe('getTaskById', () => {
    it('should return the task with the given id', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        user: mockUser,
      } as TaskEntity;
      // @ts-ignore
      tasksRepository.findOne = jest.fn().mockResolvedValue(mockTask);
      const result = await tasksRepository.getTaskById(1, mockUser);
      expect(result).toEqual(mockTask);
      // @ts-ignore
      expect(tasksRepository.findOne).toHaveBeenCalledWith({
        relations: { user: true },
        where: {
          user: { id: mockUser.id },
          id: 1,
        },
      });
    });

    it('should throw NotFoundException if task with the given id is not found', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      // @ts-ignore
      tasksRepository.findOne = jest.fn().mockResolvedValue(undefined);
      await expect(tasksRepository.getTaskById(1, mockUser)).rejects.toThrowError(NotFoundException);
    });
  });

  describe('updateTask', () => {
    it('should update the task with the given id', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        user: mockUser,
      } as TaskEntity;
      const updateTaskDto: UpdateTaskDto = {
        title: 'Updated Task',
        description: 'Updated Description',
        status: TaskStatus.DONE,
      };
      // @ts-ignore
      tasksRepository.getTaskById = jest.fn().mockResolvedValue(mockTask);
      // @ts-ignore
      tasksRepository.save = jest.fn().mockResolvedValue(mockTask);
      const result = await tasksRepository.updateTask(1, updateTaskDto, mockUser);
      expect(result).toEqual(mockTask);
      expect(mockTask.title).toEqual(updateTaskDto.title);
      expect(mockTask.description).toEqual(updateTaskDto.description);
      // @ts-ignore
      expect(tasksRepository.save).toHaveBeenCalledWith(mockTask);
    });
  });

  describe('deleteAllTasks', () => {
    it('should delete all tasks', async () => {
      const deleteResult = {
        affected: 1,
      };
      // @ts-ignore
      tasksRepository.delete = jest.fn().mockResolvedValue(deleteResult);
      // @ts-ignore
      tasksRepository.query = jest.fn();
      const result = await tasksRepository.deleteAllTasks();
      expect(result).toEqual(deleteResult.affected);
      // @ts-ignore
      expect(tasksRepository.delete).toHaveBeenCalledWith({});
      // @ts-ignore
      expect(tasksRepository.query).toHaveBeenCalledWith('ALTER SEQUENCE task_id_seq RESTART WITH 1');
    });
  });

  describe('deleteTask', () => {
    it('should delete the task with the given id', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const mockTask: TaskEntity = {
        id: 1,
        title: 'Test Task',
        description: 'Test Description',
        status: TaskStatus.OPEN,
        user: mockUser,
      } as TaskEntity;
      const deleteResult = {
        affected: 1,
      };
      // @ts-ignore
      tasksRepository.getTaskById = jest.fn().mockResolvedValue(mockTask);
      // @ts-ignore
      tasksRepository.delete = jest.fn().mockResolvedValue(deleteResult);
      await tasksRepository.deleteTask(1, mockUser);
      // @ts-ignore
      expect(tasksRepository.delete).toHaveBeenCalledWith(mockTask);
    });

    it('should throw NotFoundException if task with the given id is not found', async () => {
      const mockUser: AuthEntity = {
        id: 1,
        email: 'test@example.com',
      } as AuthEntity;
      const deleteResult = {
        affected: 0,
      };
      // @ts-ignore
      tasksRepository.getTaskById = jest.fn().mockResolvedValue({});
      // @ts-ignore
      tasksRepository.delete = jest.fn().mockResolvedValue(deleteResult);
      await expect(tasksRepository.deleteTask(1, mockUser)).rejects.toThrowError(NotFoundException);
    });
  });
});
