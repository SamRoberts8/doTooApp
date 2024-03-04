import { useState, useEffect } from 'react';
import { Todo } from '../types';

// Define the structure of a todo item

// Custom hook for managing a todo list
function useTodoList(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);

  // Load todos from local storage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }
  }, []);

  // Save todos to local storage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  // Function to add a new todo
  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: todos.length + 1, // This is a simple ID assignment strategy, consider using a more robust method
      title,
      description: 'This is a description',
      completed: false,
      sorted: false,
      createdAt: new Date(),
      completedAt: undefined,
    };
    setTodos([newTodo, ...todos]);
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          if (todo.completed) {
            return { ...todo, completed: false, completedAt: new Date() };
          }
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      }),
    );
  };

  // Function to update a todo's text
  const updateTodo = (id: number, newText: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          return { ...todo, text: newText };
        }
        return todo;
      }),
    );
  };

  // Function to delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return { todos, addTodo, toggleTodo, updateTodo, deleteTodo };
}

export default useTodoList;
