import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';

// Define the structure of a todo item

// Custom hook for managing a todo list
function useTodoList(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(initialTodos);
  const [doBeforeOrAfter, setdoBeforeOrAfter] = useState<String>();
  const [comparingTodo, setComparingTodo] = useState<Todo>();
  const [comparedTodos, setComparedTodos] = useState<Todo[]>([]);
  const [mode, setMode] = useState('view'); // 'view' or 'sort'
  const [sortingTodo, setSortingTodo] = useState<Todo>();

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

  const sortTodo = useCallback(() => {
    if (!sortingTodo || doBeforeOrAfter === undefined) return;

    const updatedTodos = [...todos];

    const sortingIndex = updatedTodos.findIndex((todo) => todo === sortingTodo);
    const targetIndex = updatedTodos.findIndex(
      (todo) => todo === comparingTodo,
    );

    if (sortingIndex < 0 || targetIndex < 0) return;

    if (doBeforeOrAfter === 'before' && targetIndex < sortingIndex) {
      sortingTodo.sorted = true;
      updatedTodos.splice(sortingIndex, 1);
      updatedTodos.splice(targetIndex - 2, 0, sortingTodo);
      setComparingTodo(undefined);
    } else if (doBeforeOrAfter === 'before') {
      sortingTodo.sorted = true;
      updatedTodos.splice(sortingIndex, 1);
      updatedTodos.splice(targetIndex - 1, 0, sortingTodo);
      setComparingTodo(undefined);
    } else if (targetIndex < sortingIndex) {
      updatedTodos.splice(sortingIndex, 1);

      updatedTodos.splice(targetIndex + 1, 0, sortingTodo);

      setComparingTodo(
        updatedTodos.length >= targetIndex
          ? updatedTodos[targetIndex + 2]
          : undefined,
      );

      if (updatedTodos.length === targetIndex + 1) {
        updatedTodos[targetIndex].sorted = true;
      }
    } else {
      updatedTodos.splice(sortingIndex, 1);
      updatedTodos.splice(targetIndex, 0, sortingTodo);

      setComparingTodo(
        updatedTodos.length >= targetIndex
          ? updatedTodos[targetIndex + 1]
          : undefined,
      );

      if (updatedTodos.length === targetIndex + 1) {
        updatedTodos[targetIndex].sorted = true;
      }
    }
    setdoBeforeOrAfter(undefined);
    setTodos(updatedTodos);
  }, [sortingTodo, doBeforeOrAfter, todos, comparingTodo]);

  const handleSortClick = (beforeOrAfter: string) => {
    if (comparingTodo === undefined) {
      return;
    }

    if (beforeOrAfter === 'before') {
      setdoBeforeOrAfter('before');
    } else {
      setdoBeforeOrAfter('after');
    }
  };

  useEffect(() => {
    sortTodo();
  }, [sortingTodo, doBeforeOrAfter, sortTodo]);

  const sortIndividualTodo = (todoToSort: Todo) => {
    setSortingTodo(todoToSort);

    if (todoToSort === todos[0]) {
      setComparingTodo(todos[1]);
    } else {
      setComparingTodo(todos[0]);
    }

    setMode('sort');
  };

  return {
    todos,
    comparingTodo,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    handleSortClick,
    mode,
    setMode,
    sortingTodo,
    setSortingTodo,
    sortIndividualTodo,
  };
}

export default useTodoList;
