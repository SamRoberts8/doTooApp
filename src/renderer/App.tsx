import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import TodoSection from './TodoSection';
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

  useEffect(() => {
    const messageHandler = (event, message) => {
      console.log('Message from main process:', message);
    };

    ipcRenderer.on('global-shortcut', messageHandler);

    return () => {
      ipcRenderer.removeListener('global-shortcut', messageHandler);
    };
  }, []);

  return (
    <div className="overflow-visible select-none h-screen  ">
      <div className="sticky top-0  z-10 pb-2">
        <NavBar />
        <div className=" h-full mx-8 flex  mr-14 ">
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
