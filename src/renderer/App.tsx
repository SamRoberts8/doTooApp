import React, { useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import TodoSection from './TodoSection';
import SortSection from './SortSection'; // Import the new component

function Home() {
  const { todos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodoList();
  const [mode, setMode] = useState('view'); // 'view' or 'sort'

  const handleModeSwitch = () => {
    setMode((prevMode) => (prevMode === 'view' ? 'sort' : 'view'));
  };

  return (
    <div className="overflow-visible">
      <div className="sticky top-0 bg-white pb-2">
        <NavBar />
        <div className=" h-full mx-8 ">
          <h1 className=" text-2xl font-bold">doToo List</h1>
          <h2 className="text-gray-400">Your relative todo list.</h2>
          <button onClick={handleModeSwitch} type="button">
            Switch to {mode === 'view' ? 'Sort' : 'View'} Mode
          </button>
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
          sortedTodos={sortedTodos}
          toggleTodo={toggleTodo}
          updateTodo={updateTodo}
          deleteTodo={deleteTodo}
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
