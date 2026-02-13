import type { Task } from './entities/task.entity';

export type TasksRepository = {
  list(): Promise<Task[]>;
  create(task: Task): Promise<Task>;
  ping(): Promise<void>;
}

export const TASKS_REPOSITORY = Symbol('TASKS_REPOSITORY');