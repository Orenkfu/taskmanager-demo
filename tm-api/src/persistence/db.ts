import { Injectable } from '@nestjs/common';

export enum TableName {
    TASKS = 'tasks',
}

@Injectable()
export class DB {
  private readonly tables: Record<TableName, Map<string, any>> = {
    tasks: new Map(),
  };

  /*
     A stub for database ping - if the process is up this "DB" is up.
  */ 
  async ping(): Promise<void> {
    return;
  }

  async insert<T>(table: TableName, id: string, value: T): Promise<T> {
    this.tables[table].set(id, value);
    return value;
  }

  async getAll<T>(table: TableName): Promise<T[]> {
    return Array.from(this.tables[table].values()) as T[];
  }

  async getById<T>(table: TableName, id: string): Promise<T | null> {
    return (this.tables[table].get(id) as T | undefined) ?? null;
  }
}
