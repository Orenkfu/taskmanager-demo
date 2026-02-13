export enum TaskStatus {
  Todo = 'todo',
  Done = 'done',
}
export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  createdAt: Date;
}