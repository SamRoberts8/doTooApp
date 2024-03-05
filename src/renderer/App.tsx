import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import TodoSection from './TodoSection';
import SortSection from './SortSection'; // Import the new component

function Home() {
  const {
    todos,
    comparingTodo,
    addTodo,
    toggleTodo,
    updateTodo,
    deleteTodo,
    handleSortClick,
  } = useTodoList();
  const [mode, setMode] = useState('view'); // 'view' or 'sort'

  const handleModeSwitch = () => {
    setMode((prevMode) => (prevMode === 'view' ? 'sort' : 'view'));
  };

  return (
    <div className="overflow-visible">
      <div className="sticky top-0 bg-white pb-2">
        <NavBar />
        <div className=" h-full mx-8 flex justify-between mr-14">
          <div>
            <h1 className=" text-2xl font-bold">doToo List</h1>
            <h2 className="text-gray-400">Your relative todo list.</h2>
          </div>
          <div className="flex items-center">
            <button
              className="h-10 px-4 py-1 text-sm border border-gray-600 text-gray-900 rounded-md"
              onClick={handleModeSwitch}
              type="button"
            >
              {mode === 'view' ? 'Sort' : 'View'} Tasks
            </button>
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
        />
      ) : (
        <SortSection
          todos={todos}
          sortingTodo={todos[0]}
          comparingTodo={comparingTodo}
          handleSortClick={handleSortClick}
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
