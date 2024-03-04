import React from 'react';

interface Todo {
  id: number;
  title: string;
  description: string;
}

interface ToDoListProps {
  todos: Todo[];
  updateTodo: (id: number, text: string) => void;
  deleteTodo: (id: number) => void;
}

function ToDoList({ todos, updateTodo, deleteTodo }: ToDoListProps) {
  return (
    <div className="m-8">
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            <div className="flex items-center my-4 gap-4 ">
              <div className="border-gray-400 border w-5 h-5 rounded-full hover:bg-green-600" />
              <div className="flex flex-col">
                <p className="font-bold text-gray-800">{todo.title}</p>
                <p className="text-gray-400 text-sm">{todo.description}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ToDoList;
