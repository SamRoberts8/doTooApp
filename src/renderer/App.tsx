import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import TodoSection from './TodoSection';
import TodoSectionSingleTodo from './TodoSectionSingleTodo';
import CompletedSection from './CompletedSection';
import SortSection from './SortSection';
import ListTitle from '../components/ui/ListTitle.tsx';
import { ipcRenderer } from 'electron';

function Home() {
  const {
    todoLists,
    changeActiveList,
    addTodoListAndSetActive,
    currentListId,
    todos,
    completedTodos,
    comparingTodo,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    renameTodo,
    handleSortClick,
    mode,
    setMode,
    sortIndividualTodo,
    sortingTodo,
    renameTodoList,
    deleteTodoList,
  } = useTodoList();

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);
  const [focusMode, setFocusMode] = useState(false);
  const [firstTodo, setFirstTodo] = useState(todos[0]);
  const [firstTodoHeight, setFirstTodoHeight] = useState(0);
  const todoSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (windowHeight <= firstTodoHeight + 100) {
      ipcRenderer.send('resize-window-minimode');
      setFocusMode(true);
    } else {
      ipcRenderer.send('resize-window-normalmode');
      setFocusMode(false);
    }
  }, [windowHeight]);

  useEffect(() => {
    if (todos.length > 0) {
      setFirstTodo(todos[0]);
    }
  }, [todos]);

  const sendDivHeight = (attemptCount: number = 0): void => {
    if (!firstTodo) {
      return; // Exit if no todo
    }

    const divElement = document.getElementById(firstTodo.id);
    let divHeight = divElement ? divElement.offsetHeight : undefined;
    if (divHeight === undefined) {
      divHeight = todoSectionRef.current?.offsetHeight;
    }

    // Check if divHeight is not obtained from divElement
    if (divHeight !== undefined && divHeight > 0) {
      // If we successfully obtained a positive height
      ipcRenderer.send('resize-window-focus', divHeight);
      setFirstTodoHeight(divHeight);
      setFocusMode(true);
    } else if (attemptCount < 5) {
      // If we failed to obtain a valid height, retry after a delay
      setTimeout(() => sendDivHeight(attemptCount + 1), 1000); // Retry after 1 second
    }
  };

  ipcRenderer.on('trigger-resize-focus', (event) => {
    if (todos.length > 0) {
      sendDivHeight();
    }
  });

  useEffect(() => {
    if (focusMode) {
      sendDivHeight();
    }
  }, [todos, firstTodo, document]);

  if (windowHeight < firstTodoHeight + 100 && todos.length > 0) {
    const todosJustFirst = todos.slice(0, 1);
    return (
      <div className="overflow-visible select-none  flex  justify-center items-center h-screen ">
        <div className="w-22 dark:text-gray-100">
          <NavBar title="Current:" height="" marginTop="" />
        </div>

        <div ref={todoSectionRef} className="todo-section-wrapper">
          <TodoSectionSingleTodo
            todos={todosJustFirst}
            addTodo={addTodo}
            toggleTodo={toggleTodo}
            updateTodo={updateTodo}
            deleteTodo={deleteTodo}
            sortIndividualTodo={sortIndividualTodo}
            showAddTaskButton={false}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-visible select-none  flex flex-col  h-screen">
      <div className="flex-none z-10 pb-2">
        <NavBar title={''} height="h-12" marginTop="mt-4" />
        <div className=" mx-8 flex  mr-14 ">
          <ListTitle
            todoLists={todoLists}
            currentListId={currentListId}
            changeActiveList={changeActiveList}
            addTodoListAndSetActive={addTodoListAndSetActive}
            todos={todos}
            completedTodos={completedTodos}
            setMode={setMode}
            renameTodoList={renameTodoList}
            deleteTodoList={deleteTodoList}
          />
        </div>
      </div>

      {mode === 'view' ? (
        <TodoSection
          todos={todos}
          addTodo={addTodo}
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
          renameTodo={renameTodo}
          sortIndividualTodo={sortIndividualTodo}
          showAddTaskButton={true}
        />
      ) : mode === 'sort' ? (
        <SortSection
          todos={todos}
          sortingTodo={sortingTodo}
          comparingTodo={comparingTodo}
          handleSortClick={handleSortClick}
          setMode={setMode}
        />
      ) : (
        <CompletedSection completedTodos={completedTodos} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
}
