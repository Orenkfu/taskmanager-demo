import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { RequestLoggerMiddleware } from './middleware/request-logger.middleware';
import { PersistenceModule } from './persistence/persistence.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [TasksModule, PersistenceModule, HealthModule],
  controllers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}