import { useState, useEffect } from 'react';

// Define the structure of a todo item
interface TodoItem {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  sorted: boolean;
}

// Custom hook for managing a todo list
function useTodoList(initialTodos: TodoItem[] = []) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);

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
    const newTodo: TodoItem = {
      id: todos.length + 1, // This is a simple ID assignment strategy, consider using a more robust method
      title,
      description: 'This is a description',
      completed: false,
      sorted: false,
    };
    setTodos([...todos, newTodo]);
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = (id: number) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
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
