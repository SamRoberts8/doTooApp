import { useState, useEffect } from 'react';
import { Todo } from '../types';

// Define the structure of a todo item

// Custom hook for managing a todo list
function useTodoList(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(initialTodos);
  const [sortedTodos, setSortedTodos] = useState<Todo[]>([]);
  const [doSoonerThanTodo, setdoSoonerThanTodo] = useState<Todo>();
  const [doLaterThanTodo, setdoLaterThanTodo] = useState<Todo>();
  const [comparingTodo, setComparingTodo] = useState<Todo>();

  // Load todos from local storage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }

    const storedCompletedTodos = localStorage.getItem('completedTodos');
    if (storedCompletedTodos) {
      setCompletedTodos(JSON.parse(storedCompletedTodos));
    }
  }, []);

  // Save todos to local storage whenever todos change
  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
    localStorage.setItem('completedTodos', JSON.stringify(completedTodos));
  }, [todos, completedTodos]);

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
      todos
        .map((todo) => {
          if (todo.id === id) {
            const updatedTodo = { ...todo, completed: !todo.completed };
            if (updatedTodo.completed) {
              updatedTodo.completedAt = new Date();
              setCompletedTodos([updatedTodo, ...completedTodos]);
            } else {
              setCompletedTodos(
                completedTodos.filter(
                  (completedTodo) => completedTodo.id !== id,
                ),
              );
            }
            return updatedTodo;
          }
          return todo;
        })
        .filter((todo) => !todo.completed),
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

  const sortToDo = (Todo: Todo, todos: Todo[]) => {
    // Function to sort todos
    if (Todo === undefined) {
      return;
    }

    const currentIndex = todos.findIndex((todo) => todo.id === Todo.id);

    if (
      todos[currentIndex + 1] === undefined &&
      todos[currentIndex - 1] === doLaterThanTodo
    ) {
      console.log('Do later than', Todo);
      setTodos([
        ...todos.slice(0, currentIndex),
        ...todos.slice(currentIndex + 1),
        Todo,
      ]);
      return;
    }
    if (
      todos[currentIndex - 1] === undefined &&
      todos[currentIndex + 1] === doSoonerThanTodo
    ) {
      console.log('Do sooner than', doSoonerThanTodo);
      setTodos([
        Todo,
        ...todos.slice(0, currentIndex),
        ...todos.slice(currentIndex + 1),
      ]);
    }
    setdoSoonerThanTodo(undefined);
    setdoLaterThanTodo(undefined);
  };

  // useEffect(() => {
  //   if (doSoonerThanTodo !== undefined || doLaterThanTodo !== undefined) {
  //     if (doSoonerThanTodo) {
  //       sortToDo(doSoonerThanTodo, todos);
  //     }
  //     if (doLaterThanTodo) {
  //       sortToDo(doLaterThanTodo, todos);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [doSoonerThanTodo, doLaterThanTodo]);

  const handleSortClick = (soonerOrLater: string) => {
    if (soonerOrLater === 'sooner') {
      setdoSoonerThanTodo(comparingTodo);
    } else {
      setdoLaterThanTodo(comparingTodo);
    }
  };

  useEffect(() => {
    if (todos.length > 1 && comparingTodo === undefined) {
      setComparingTodo(todos[1]);
    }
    if (todos.length <= 1) {
      setComparingTodo(undefined);
    }
  }, [todos, comparingTodo]);

  return {
    todos,
    comparingTodo,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    handleSortClick,
  };
}

export default useTodoList;
