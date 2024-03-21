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
  showAddTaskButton: boolean;
}

const TodoSectionSingleTodo: React.FC<TodoSectionProps> = ({
  todos,
  addTodo,
  toggleTodo,
  updateTodo,
  deleteTodo,
  sortIndividualTodo,
  showAddTaskButton,
}) => {
  return (
    <div className="flex flex-col h-15 -mt-4 justify-between overflow-auto ">
      <ToDoList
        todos={todos}
        updateTodo={updateTodo}
        deleteTodo={deleteTodo}
        toggleTodo={toggleTodo}
        sortIndividualTodo={sortIndividualTodo}
      />
      {showAddTaskButton && <AddTaskButton addTodo={addTodo} />}
    </div>
  );
};

export default TodoSectionSingleTodo;
