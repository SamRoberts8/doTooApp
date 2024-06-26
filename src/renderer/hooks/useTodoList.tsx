import { useState, useEffect, useCallback } from 'react';
import { ipcRenderer } from 'electron';
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

    ipcRenderer.send('backup-data', JSON.stringify(todoLists));
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

  const renameTodoList = (id: string, newName: string): void => {
    const updatedTodoLists = [...todoLists];
    const todoListIndex = updatedTodoLists.findIndex((t) => t.id === id);
    updatedTodoLists[todoListIndex].name = newName;
    setTodoLists(updatedTodoLists);
  };

  const deleteTodoList = (id: string): void => {
    const updatedTodoLists = todoLists.filter((list) => list.id !== id);
    setTodoLists(updatedTodoLists);
    if (updatedTodoLists.length > 0) {
      setCurrentListId(updatedTodoLists[0].id);
    }
  };

  // Function to add a new todo at a specific index
  const addTodo = (title: string, index: number) => {
    const newTodo: Todo = {
      id: uuidv4(),
      title,
      description: 'This is a description',
      completed: false,
      sorted: false,
      createdAt: new Date().toISOString,
      completedAt: undefined,
    };
    const updatedLists = todoLists.map((list) => {
      if (list.id === currentListId) {
        // Copy the existing todos, insert the new todo at the specified index
        const newTodos = [...list.todos];
        newTodos.splice(index, 0, newTodo); // Insert the newTodo at the 'index'
        return { ...list, todos: newTodos };
      }
      return list;
    });
    setTodoLists(updatedLists);
  };

  const addSubTaskToTodo = (title: string, todoId: string) => {
    const newSubTask: Todo = {
      id: uuidv4(),
      title,
      description: 'This is a description',
      completed: false,
      sorted: false,
      createdAt: new Date().toISOString,
      completedAt: undefined,
    };

    const updatedLists = todoLists.map((list) => {
      if (list.id === currentListId) {
        const newTodos = list.todos.map((todo) => {
          if (todo.id === todoId) {
            const newSubTasks = todo.subTasks || [];
            return { ...todo, subTasks: [...newSubTasks, newSubTask] };
          }
          return todo;
        });
        return { ...list, todos: newTodos };
      }
      return list;
    });
    setTodoLists(updatedLists);
  };

  // Function to toggle the completed status of a todo and its subtasks
  const toggleTodo = (id: string) => {
    const updatedTodos = [...todos];
    setTodos(
      updatedTodos
        .map((todo) => {
          if (todo.id === id) {
            const updatedTodo = { ...todo, completed: !todo.completed };
            if (updatedTodo.completed) {
              updatedTodo.completedAt = new Date().toISOString();
              setCompletedTodos([updatedTodo, ...completedTodos]);
            } else {
              updatedTodo.completedAt = undefined;
              setCompletedTodos(
                completedTodos.filter(
                  (completedTodo) => completedTodo.id !== id,
                ),
              );
            }
            return updatedTodo;
          }
          if (todo.subTasks?.find((subTask) => subTask.id === id)) {
            const newSubTasks = todo.subTasks.map((subTask) => {
              if (subTask.id === id) {
                const updatedSubTask = {
                  ...subTask,
                  completed: !subTask.completed,
                };
                if (updatedSubTask.completed) {
                  updatedSubTask.completedAt = new Date();
                  todo.completedSubTasks = [
                    ...(todo.completedSubTasks || []),
                    updatedSubTask,
                  ];
                } else {
                  updatedSubTask.completedAt = undefined;
                  todo.completedSubTasks =
                    todo.completedSubTasks?.filter((st) => st.id !== id) || [];
                }
                return updatedSubTask;
              }
              return subTask;
            });
            todo.subTasks = newSubTasks.filter((st) => !st.completed);
            return { ...todo };
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
    const updatedLists = todoLists.map((list) => {
      if (list.id === currentListId) {
        const updatedTodos = list.todos.filter((todo) => {
          if (todo.id === id.toString()) {
            return false;
          }
          if (todo.subTasks) {
            todo.subTasks = todo.subTasks.filter(
              (subTask) => subTask.id !== id.toString(),
            );
          }
          return true;
        });
        return { ...list, todos: updatedTodos };
      }
      return list;
    });
    setTodoLists(updatedLists);
  };

  const renameTodo = (id: string, newName: string): void => {
    const updatedLists = todoLists.map((list) => {
      if (list.id === currentListId) {
        const updatedTodos = list.todos.map((todo) => {
          if (todo.id === id) {
            return { ...todo, title: newName };
          }
          if (todo.subTasks) {
            const updatedSubtasks = todo.subTasks.map((subtask) => {
              if (subtask.id === id) {
                return { ...subtask, title: newName };
              }
              return subtask;
            });
            return { ...todo, subTasks: updatedSubtasks };
          }
          return todo;
        });
        return { ...list, todos: updatedTodos };
      }
      return list;
    });
    setTodoLists(updatedLists);
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
    renameTodo,
    handleSortClick,
    mode,
    setMode,
    sortingTodo,
    setSortingTodo,
    sortIndividualTodo,
    renameTodoList,
    deleteTodoList,
    addSubTaskToTodo,
  };
}

export default useTodoList;
