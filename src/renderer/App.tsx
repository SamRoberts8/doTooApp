import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import TodoSection from './TodoSection';
import TodoSectionSingleTodo from './TodoSectionSingleTodo';
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
    comparingTodo,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    handleSortClick,
    mode,
    setMode,
    sortIndividualTodo,
    sortingTodo,
  } = useTodoList();

  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

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
    if (windowHeight <= 150) {
      ipcRenderer.send('resize-window-minimode');
    } else {
      ipcRenderer.send('resize-window-normalmode');
    }
  }, [windowHeight]);

  if (windowHeight < 200) {
    const todosJustFirst = todos.slice(0, 1);
    return (
      <div className="overflow-visible select-none  flex  justify-center items-center h-screen ">
        <div className="w-22 ">
          <NavBar title="Current:" />
        </div>

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
    );
  }

  return (
    <div className="overflow-visible select-none  flex flex-col  h-screen">
      <div className="flex-none z-10 pb-2">
        <NavBar title={''} />
        <div className=" mx-8 flex  mr-14 ">
          <ListTitle
            todoLists={todoLists}
            currentListId={currentListId}
            changeActiveList={changeActiveList}
            addTodoListAndSetActive={addTodoListAndSetActive}
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
          sortIndividualTodo={sortIndividualTodo}
          showAddTaskButton={true}
        />
      ) : (
        <SortSection
          todos={todos}
          sortingTodo={sortingTodo}
          comparingTodo={comparingTodo}
          handleSortClick={handleSortClick}
          setMode={setMode}
        />
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
