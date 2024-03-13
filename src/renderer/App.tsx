import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import TodoSection from './TodoSection';
import SortSection from './SortSection';

function Home() {
  const {
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

  return (
    <div className="overflow-visible select-none h-screen  ">
      <div className="sticky top-0  z-10 pb-2">
        <NavBar />
        <div className=" h-full mx-8 flex justify-between mr-14 ">
          <div>
            <h1 className=" text-2xl font-bold">doToo List</h1>
            <h2 className="text-gray-800 opacity-40">
              Your relative todo list.
            </h2>
          </div>
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
