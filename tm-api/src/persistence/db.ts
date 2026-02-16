import { Injectable } from '@nestjs/common';

export enum TableName {
    TASKS = 'tasks',
}

@Injectable()
export class DB {
  private readonly tables: Record<TableName, Map<string, any>> = {
    [TableName.TASKS]: new Map(),
  };
  private healthy = true;

  setHealthy(v: boolean) { this.healthy = v; }

  async ping(): Promise<void> {
    if (!this.healthy) throw new Error('DB unavailable');
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
