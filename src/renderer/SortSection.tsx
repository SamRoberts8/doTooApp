/* eslint-disable react/function-component-definition */
// SortSection.tsx
import React from 'react';
import ToDoList from './ToDoList';
import { Todo } from './types'; // Reuse the Todo type

interface SortSectionProps {
  sortedTodos: Todo[];
  toggleTodo: (id: number) => void;
  updateTodo: (id: number, newTask: string) => void;
  deleteTodo: (id: number) => void;
}

const SortSection: React.FC<SortSectionProps> = ({
  sortedTodos,
  toggleTodo,
  updateTodo,
  deleteTodo,
}) => {
  return (
    <ToDoList
      todos={sortedTodos}
      updateTodo={updateTodo}
      deleteTodo={deleteTodo}
      toggleTodo={toggleTodo}
    />
  );
};

export default SortSection;
