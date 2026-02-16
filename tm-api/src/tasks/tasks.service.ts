import { Injectable, Inject, BadRequestException } from '@nestjs/common';
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
    const title = dto.title.trim();
    // Prefer explicit transform, if more shows up I'd extract it to transformation rules
    if (!title) {
      throw new BadRequestException('title must not be empty');
    }
    const task: Task = {
      id: randomUUID(),
      title: dto.title.trim(),
      status: dto.status ?? TaskStatus.Todo,
      createdAt: new Date(),
    };

    return this.repo.create(task);
  }
}