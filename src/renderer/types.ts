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

export interface TodoList {
  id: string;
  name: string;
  todos: Todo[];
  completedTodos: Todo[];
}
