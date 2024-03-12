/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Todo } from './types';
import AlertIcon from './icons/AlertIcon';

interface ToDoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
}

function ToDoList({ todos, toggleTodo, sortIndividualTodo }: ToDoListProps) {
  const todosLength = todos.length;
  const lastTodo = todos[todosLength - 1];

  return (
    <div className="mx-8 my-6 max-h-64 overflow-auto">
      <ul>
        {todos.map((todo) => {
          if (todo.completed) {
            return null; // Skip rendering the todo if it is completed
          }
          return (
            <li key={todo.id} className="group -z-10">
              <div>
                <div className="flex items-center justify-between my- gap-4 relative ">
                  <div className="flex gap-4 items-center">
                    <div
                      className="border-gray-400 border w-5 h-5 flex-shrink-0 rounded-full hover:bg-green-700 cursor-pointer"
                      onClick={() => toggleTodo(todo.id)}
                    />
                    <div className="flex flex-col w-56">
                      <p className="font-bold text-gray-800 break-words">
                        {todo.title}
                      </p>
                      <p className="text-gray-400 text-sm break-words">
                        {todo.description}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => sortIndividualTodo(todo)}
                    className="hidden h-8 px-4 py-1 text-sm bg-gray-800 text-white rounded-md group-hover:flex absolute right-0 mt-2 mr-2  items-center justify-center"
                  >
                    Sort
                  </button>
                  {todo.sorted ? '' : <AlertIcon />}
                </div>
              </div>
              {todo === lastTodo ? (
                ''
              ) : (
                <div className="mt-2 mb-4  border-b  border-gray-300" />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ToDoList;
