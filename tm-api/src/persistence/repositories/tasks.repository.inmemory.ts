import { Injectable } from '@nestjs/common';
import type { Task } from '../../tasks/entities/task.entity';
import type { TasksRepository } from '../../tasks/tasks.repository';
import { DB, TableName } from '../db';


@Injectable()
export class TasksRepositoryInMemory implements TasksRepository {
    constructor(private readonly db: DB) {}

  async list(): Promise<Task[]> {
    return this.db.getAll<Task>(TableName.TASKS);
  }

  async create(task: Task): Promise<Task> {
    return this.db.insert<Task>(TableName.TASKS, task.id, task);
  }
}