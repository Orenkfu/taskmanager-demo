import { Module } from '@nestjs/common';
import { DB } from './db';
import { PERSISTENCE_HEALTH } from './persistence.health';
import { TasksRepositoryImpl } from './repositories/tasks.repository.impl';
import { TASKS_REPOSITORY } from '../tasks/tasks.repository';

@Module({
  providers: [
    DB,
    { provide: PERSISTENCE_HEALTH, useExisting: DB },
    TasksRepositoryImpl,
    { provide: TASKS_REPOSITORY, useExisting: TasksRepositoryImpl },
  ],
  exports: [
    PERSISTENCE_HEALTH,
    TASKS_REPOSITORY,
  ],
})
export class PersistenceModule {}
