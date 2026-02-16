import { TasksRepositoryInMemory } from './tasks.repository.inmemory';
import { DB } from '../db';
import { TaskStatus, type Task } from '../../tasks/entities/task.entity';

describe('TasksRepositoryInMemory', () => {
  it('create stores task and list returns it', async () => {
    const db = new DB();
    const repo = new TasksRepositoryInMemory(db);

    const task: Task = {
      id: '1',
      title: 'hello',
      status: TaskStatus.Todo,
      createdAt: new Date('2026-02-14T00:00:00Z'),
    };

    await repo.create(task);
    await expect(repo.list()).resolves.toEqual([task]);
  });
});
