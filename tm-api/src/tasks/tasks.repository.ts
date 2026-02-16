import type { Task } from './entities/task.entity';

export interface TasksRepository {
  list(): Promise<Task[]>;
  create(task: Task): Promise<Task>;
}

export const TASKS_REPOSITORY = Symbol('TASKS_REPOSITORY');