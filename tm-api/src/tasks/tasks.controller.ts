import { Body, Controller, Get, HttpCode, Post } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import type { Task } from './entities/task.entity';

@Controller('tasks')
export class TasksController {
  constructor(private readonly service: TasksService) {}

  @Get()
  async list(): Promise<Task[]> {
    return this.service.listTasks();
  }

  @Post()
  @HttpCode(201)
  async create(@Body() dto: CreateTaskDto): Promise<Task> {
    return this.service.createTask(dto);
  }
}