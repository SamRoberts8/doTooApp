/* eslint-disable react/function-component-definition */
// TodoSection.tsx
import React from 'react';
import ToDoList from './ToDoList';
import AddTaskButton from './AddTaskButton';
import { Todo } from './types'; // Assuming you have a types file for Todo, if not, define it here.

interface TodoSectionProps {
  todos: Todo[];
  addTodo: (todo: string) => void;
  toggleTodo: (id: number) => void;
  updateTodo: (id: number, newTask: string) => void;
  deleteTodo: (id: number) => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
}) => {
  return (
    <>
      <ToDoList
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
      />
      <div className="my-4  mx-8 border-b  border-gray-200" />
      <AddTaskButton addTodo={addTodo} />
    </>
  );
};

export default TodoSection;
