import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TASKS_REPOSITORY, type TasksRepository } from './tasks.repository';
import { TaskStatus } from './entities/task.entity';

describe('TasksService', () => {
  let service: TasksService;
  let repo: jest.Mocked<TasksRepository>;

  beforeEach(async () => {
    repo = {
      list: jest.fn(),
      create: jest.fn(),
      ping: jest.fn()
    };

    const moduleRef = await Test.createTestingModule({
      providers: [
        TasksService,
        { provide: TASKS_REPOSITORY, useValue: repo },
      ],
    }).compile();

    service = moduleRef.get(TasksService);
  });

  it('listTasks returns tasks from repository', async () => {
    const now = new Date();
    repo.list.mockResolvedValue([
      { id: '1', title: 't1', status: TaskStatus.Todo, createdAt: now },
    ]);

    const tasks = await service.listTasks();

    expect(repo.list).toHaveBeenCalledTimes(1);
    expect(tasks).toEqual([
      { id: '1', title: 't1', status: TaskStatus.Todo, createdAt: now },
    ]);
  });

  it('createTask trims title and sets default status', async () => {
    repo.create.mockImplementation(async (t) => t);

    const task = await service.createTask({ title: '  hello  ' });

    expect(repo.create).toHaveBeenCalledTimes(1);
    expect(task.title).toBe('hello');
    expect(task.status).toBe(TaskStatus.Todo);
    expect(task.id).toBeDefined();
    expect(task.createdAt).toBeInstanceOf(Date);
  });

  it('createTask honors explicit status', async () => {
    repo.create.mockImplementation(async (t) => t);

    const task = await service.createTask({
      title: 'x',
      status: TaskStatus.Done,
    });

    expect(task.status).toBe(TaskStatus.Done);
  });
});
