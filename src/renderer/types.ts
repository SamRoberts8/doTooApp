// types.ts

export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  sorted: boolean;
  createdAt: Date;
  completedAt?: Date;
}
