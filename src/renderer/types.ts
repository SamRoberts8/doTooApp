// types.ts

export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  sorted: boolean;
  createdAt: Date;
  completedAt?: Date;
}
