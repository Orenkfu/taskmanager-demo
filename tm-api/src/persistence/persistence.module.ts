import { Module } from '@nestjs/common';
import { DB } from './db';
import { PERSISTENCE_HEALTH } from './persistence.health';
import { TasksRepositoryInMemory } from './repositories/tasks.repository.inmemory';
import { TASKS_REPOSITORY } from '../tasks/tasks.repository';

@Module({
  providers: [
    DB,
    { provide: PERSISTENCE_HEALTH, useExisting: DB },
    TasksRepositoryInMemory,
    { provide: TASKS_REPOSITORY, useExisting: TasksRepositoryInMemory },
  ],
  exports: [
    PERSISTENCE_HEALTH,
    TASKS_REPOSITORY,
  ],
})
export class PersistenceModule { }
