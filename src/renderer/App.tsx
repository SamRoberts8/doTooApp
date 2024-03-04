import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import useTodoList from './hooks/useTodoList';
import NavBar from './NavBar';
import './App.css';
import AddTaskButton from './AddTaskButton';
import ToDoList from './ToDoList';

function Home() {
  // Use the custom hook to manage a todo list
  const { todos, addTodo, toggleTodo, updateTodo, deleteTodo } = useTodoList();

  return (
    <div className="overflow-visible">
      <div className="sticky top-0 bg-white pb-2">
        <NavBar />
        <div className=" h-full mx-8 ">
          <h1 className=" text-2xl font-bold">doToo List</h1>
          <h2 className="text-gray-400">Your relative todo list.</h2>
        </div>
      </div>
      <ToDoList todos={todos} updateTodo={updateTodo} deleteTodo={deleteTodo} />
      <div className="my-4  mx-8 border-b border-gray-200" />
      <AddTaskButton addTodo={addTodo} />
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
