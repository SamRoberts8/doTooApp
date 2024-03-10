/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Todo } from './types';

interface ToDoListProps {
  todos: Todo[];
  toggleTodo: (id: number) => void;
  updateTodo: (id: number, newTask: string) => void;
  deleteTodo: (id: number) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
}

function ToDoList({ todos, toggleTodo, sortIndividualTodo }: ToDoListProps) {
  return (
    <div className="m-8">
      <ul>
        {todos.map((todo) => {
          if (todo.completed) {
            return null; // Skip rendering the todo if it is completed
          }
          return (
            <li key={todo.id}>
              <div className="flex items-center my-4 gap-4 ">
                <div
                  className="border-gray-400 border w-5 h-5 rounded-full hover:bg-green-700 cursor-pointer"
                  onClick={() => toggleTodo(todo.id)}
                />
                <div className="flex flex-col">
                  <p className="font-bold text-gray-800">{todo.title}</p>
                  <p className="text-gray-400 text-sm">{todo.description}</p>
                </div>
                <button
                  type="button"
                  onClick={() => sortIndividualTodo(todo)}
                  className="text-red-500"
                >
                  Sort (currently {todo.sorted ? 'sorted' : 'unsorted'})
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ToDoList;
