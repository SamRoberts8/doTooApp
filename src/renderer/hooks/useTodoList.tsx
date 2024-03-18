import { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Todo, TodoList } from '../types';

// Define the structure of a todo item
function useTodoList(initialTodos: Todo[] = []) {
  const [todoLists, setTodoLists] = useState<TodoList[]>([]);
  const [currentListId, setCurrentListId] = useState<string>('');
  const [todos, setTodos] = useState<Todo[]>(initialTodos);
  const [completedTodos, setCompletedTodos] = useState<Todo[]>(initialTodos);
  const [doBeforeOrAfter, setDoBeforeOrAfter] = useState<string>();
  const [comparingTodo, setComparingTodo] = useState<Todo>();
  const [mode, setMode] = useState('view'); // 'view' or 'sort'
  const [sortingTodo, setSortingTodo] = useState<Todo>();

  const storageKey = 'todoListsStorage';

  const changeActiveList = (id: string) => {
    setCurrentListId(id);
  };

  const addTodoListAndSetActive = (name: string) => {
    const newListId = uuidv4(); // Generate the new list ID
    const newList = {
      id: newListId,
      name,
      todos: [],
      completedTodos: [],
    };

    // Assuming setTodoLists is a function that updates the state of todo lists
    setTodoLists((prevLists) => [...prevLists, newList]);

    // Set the newly created list as the active list
    changeActiveList(newListId);
  };

  useEffect(() => {
    // Attempt to load todo lists from local storage
    const storedTodoLists = localStorage.getItem(storageKey);
    if (storedTodoLists) {
      const todoListsLocal = JSON.parse(storedTodoLists);
      const lastUsedListId = localStorage.getItem('lastUsedListId');
      setTodoLists(todoListsLocal);

      // If there are existing lists, set the first one as the current list.
      if (lastUsedListId !== null) {
        setCurrentListId(lastUsedListId);
      } else if (todoListsLocal.length > 0) {
        setCurrentListId(todoListsLocal[0].id);
      }
    } else {
      const defaultListId = uuidv4();
      const defaultList = [
        {
          id: defaultListId,
          name: 'doToo List',
          todos: [],
          completedTodos: [],
        },
      ];
      localStorage.setItem(storageKey, JSON.stringify(defaultList));
      localStorage.setItem('lastUsedListId', defaultListId);
      setTodoLists(defaultList);
      setCurrentListId(defaultListId);
    }
  }, []); // Note: This effect should truly only run once, hence the empty dependency array.

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(todoLists));
    localStorage.setItem('lastUsedListId', currentListId);
  }, [todoLists, storageKey, currentListId]);

  useEffect(() => {
    // Update todos and completedTodos based on currentListId change
    const currentList = todoLists.find((list) => list.id === currentListId);
    if (currentList) {
      setTodos(currentList.todos || []);
      setCompletedTodos(currentList.completedTodos || []);
    }
  }, [currentListId, todoLists]);

  const updateCurrentTodoList = (currentListId, todos, completedTodos) => {
    // Map over the todoLists to find and update the current list
    const updatedLists = todoLists.map((list) => {
      if (list.id === currentListId) {
        // Found the current list, now update its todos and completedTodos
        return { ...list, todos: todos, completedTodos: completedTodos };
      }
      // Return other lists unchanged
      return list;
    });

    // Update the todoLists state with the new array of lists
    setTodoLists(updatedLists);
  };

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
    const updatedLists = todoLists.map((list) => {
      if (list.id === currentListId) {
        return { ...list, todos: [newTodo, ...list.todos] };
      }
      return list;
    });
    setTodoLists(updatedLists);
  };

  // Function to toggle the completed status of a todo
  const toggleTodo = (id: number) => {
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

  useEffect(() => {
    if (!currentListId || !todos) return;
    updateCurrentTodoList(currentListId, todos, completedTodos);
  }, [todos, completedTodos]);

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
      updatedTodos.splice(targetIndex ? targetIndex - 2 : 0, 0, sortingTodo);
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
    setDoBeforeOrAfter(undefined);
    setTodos(updatedTodos);
  }, [sortingTodo, doBeforeOrAfter, todos, comparingTodo]);

  const handleSortClick = (beforeOrAfter: string) => {
    if (comparingTodo === undefined) {
      return;
    }

    if (beforeOrAfter === 'before') {
      setDoBeforeOrAfter('before');
    } else {
      setDoBeforeOrAfter('after');
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
    currentListId,
    setCurrentListId,
    todos,
    completedTodos,
    changeActiveList,
    addTodoListAndSetActive,
    addTodo,
    comparingTodo,
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
