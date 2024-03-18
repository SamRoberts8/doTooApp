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
  sortIndividualTodo: (todoToSort: Todo) => void;
}

const TodoSection: React.FC<TodoSectionProps> = ({
  todos,
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  sortIndividualTodo,
}) => {
  return (
    <div className=" flex-shrink flex flex-col max-h-[338px]">
      <ToDoList
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
        sortIndividualTodo={sortIndividualTodo}
      />

      <AddTaskButton addTodo={addTodo} />
    </div>
  );
};

export default TodoSection;
