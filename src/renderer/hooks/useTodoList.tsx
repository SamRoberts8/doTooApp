import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from '../types';

// Define the structure of a todo item
function useTodoList(initialTodos: Todo[] = []) {
  const [todoLists, setTodoLists] = useState<string[]>(['doToo List']);
  const [cleanTodoListNames, setCleanTodoListNames] = useState<string[]>([]);
  const [listName, setListName] = useState<string>('doToo List');
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(initialTodos);
  const [doBeforeOrAfter, setDoBeforeOrAfter] = useState<string>();
  const [comparingTodo, setComparingTodo] = useState<Todo>();
  const [mode, setMode] = useState('view'); // 'view' or 'sort'
  const [sortingTodo, setSortingTodo] = useState<Todo>();
  const [todosKey, setTodosKey] = useState<string>('todos_doToo List');
  const [completedTodosKey, setCompletedTodosKey] = useState<string>(
    'completedTodos_doToo List',
  );

  useEffect(() => {
    // Update the todos and completedTodos keys whenever the listName changes
    if (listName) {
      setTodosKey(`todos_${listName}`);
      setCompletedTodosKey(`completedTodos_${listName}`);
    }
  }, [listName]);

  useEffect(() => {
    const keys = Object.keys(localStorage);
    const todoListKeys = keys.filter((key) => key.includes('todos'));
    setTodoLists(todoListKeys);

    const cleanedTodoListNames = todoListKeys.map((key) =>
      key.replace('todos_', ''),
    );
    setCleanTodoListNames(cleanedTodoListNames);
  }, [listName]);

  // Load todos from local storage on component mount
  useEffect(() => {
    const storedTodos = localStorage.getItem(todosKey);
    if (storedTodos) {
      setTodos(JSON.parse(storedTodos));
    }

    const storedCompletedTodos = localStorage.getItem(completedTodosKey);
    if (storedCompletedTodos) {
      setCompletedTodos(JSON.parse(storedCompletedTodos));
    }
  }, [completedTodosKey, listName, todosKey]);

  // Save todos to local storage whenever todos change
  useEffect(() => {
    localStorage.setItem(todosKey, JSON.stringify(todos));
    localStorage.setItem(completedTodosKey, JSON.stringify(completedTodos));
  }, [todos, completedTodos, todosKey, completedTodosKey]);

  // Function to add a new todo
  const addTodo = (title: string) => {
    const newTodo: Todo = {
      id: uuidv4(),
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
    console.log('toggleTodo');
    const updatedTodos = [...todos];
    setTodos(
      updatedTodos
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
        if (todo.id === id.toString()) {
          return { ...todo, text: newText };
        }
        return todo;
      }),
    );
  };

  // Function to delete a todo
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id.toString()));
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
      setMode('view');
    } else if (doBeforeOrAfter === 'before') {
      sortingTodo.sorted = true;
      updatedTodos.splice(sortingIndex, 1);
      updatedTodos.splice(targetIndex - 1, 0, sortingTodo);
      setComparingTodo(undefined);
      setMode('view');
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
        setMode('view');
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
        setMode('view');
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

    const todoToSortIndex = todos.findIndex((todo) => todo === todoToSort);

    if (todoToSort.sorted) {
      const updatedTodos = [...todos];
      updatedTodos[todoToSortIndex].sorted = false;
      setTodos(updatedTodos);
    }

    if (todoToSort === todos[0]) {
      setComparingTodo(todos[1]);
    } else {
      setComparingTodo(todos[0]);
    }

    setMode('sort');
  };

  return {
    todoLists,
    cleanTodoListNames,
    listName,
    setListName,
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
