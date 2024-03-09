import { useState, useEffect, useCallback } from 'react';
import { Todo } from '../types';
import { todo } from 'node:test';

// Define the structure of a todo item

// Custom hook for managing a todo list
function useTodoList(initialTodos: Todo[] = []) {
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(initialTodos);
  const [doBeforeThanTodo, setdoBeforeThanTodo] = useState<Todo>();
  const [doAfterThanTodo, setdoAfterThanTodo] = useState<Todo>();
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
    if (sortingTodo === undefined) {
      return;
    }

    const doAfterThanTodoIndex = todos.findIndex(
      (t) => t.id === doAfterThanTodo?.id,
    );

    if (todos[doAfterThanTodoIndex + 1] === undefined) {
      const newTodos = [
        ...todos.filter((t) => t.id !== sortingTodo.id),
        sortingTodo,
      ];
      setTodos(newTodos);
      setMode('view');
      return;
    }

    if (todos[0] === doBeforeThanTodo) {
      const newTodos = [
        sortingTodo,
        ...todos.filter((t) => t.id !== sortingTodo.id),
      ];
      setTodos(newTodos);
    }

    if (doAfterThanTodo !== undefined) {
      const filteredTodos = todos.filter((t) => t.id !== sortingTodo.id);
      console.log('Filtered todos', filteredTodos);
      filteredTodos.splice(doAfterThanTodoIndex, 0, sortingTodo);
      console.log('new todos', filteredTodos);
      setTodos(filteredTodos);
    }

    if (comparingTodo) {
      setComparedTodos([comparingTodo, ...comparedTodos]);
    }

    setdoBeforeThanTodo(undefined);
    setdoAfterThanTodo(undefined);
  }, [sortingTodo, todos, doBeforeThanTodo, doAfterThanTodo]);

  const handleSortClick = (beforeOrAfter: string) => {
    if (comparingTodo === undefined) {
      return;
    }

    if (beforeOrAfter === 'before') {
      setdoBeforeThanTodo(comparingTodo);
    } else {
      console.log('Do after than', comparingTodo);
      setdoAfterThanTodo(comparingTodo);
    }
  };

  // Make a list of comparedTodos so that the compared todo can be highlighted properly.
  useEffect(() => {
    if (comparedTodos.length === 0 || !comparingTodo) {
      return;
    }
    const nextToCompareIndex =
      todos.findIndex((t) => t.id === comparingTodo.id) + 1;

    const nextToCompareTodo = todos[nextToCompareIndex];

    if (comparedTodos.some((t) => t.id === nextToCompareTodo?.id)) {
      console.log('Next to compare', nextToCompareTodo);
      setComparingTodo(undefined);
      setMode('view');
    } else {
      setComparingTodo(nextToCompareTodo);
    }
  }, [comparedTodos, comparingTodo, todos]);

  useEffect(() => {
    if (doBeforeThanTodo !== undefined || doAfterThanTodo !== undefined) {
      sortTodo();
    }
  }, [doBeforeThanTodo, doAfterThanTodo, sortTodo]);

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
