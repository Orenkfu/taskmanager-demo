import { Injectable, Inject } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Task, TaskStatus } from './entities/task.entity';
import type { CreateTaskDto } from './dto/create-task.dto';
import type { TasksRepository } from './tasks.repository';
import { TASKS_REPOSITORY } from './tasks.repository';

@Injectable()
export class TasksService {
  constructor(
    @Inject(TASKS_REPOSITORY) private readonly repo: TasksRepository,
  ) {}

  async listTasks(): Promise<Task[]> {
    return this.repo.list();
  }

  async createTask(dto: CreateTaskDto): Promise<Task> {
    console.log("Creating Task: ", dto)
    const task: Task = {
      id: randomUUID(),
      title: dto.title.trim(),
      status: dto.status ?? TaskStatus.Todo,
      createdAt: new Date(),
    };

    return this.repo.create(task);
  }
}