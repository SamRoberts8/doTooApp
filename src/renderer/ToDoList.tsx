/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from 'react';
import Rive from '@rive-app/react-canvas';
import confettiAnimation from './confetti.riv';
import AlertIcon from './icons/AlertIcon';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
  ContextMenuSeparator,
} from '../components/ui/context-menu';

import { Todo } from './types';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  renameTodo: (id: string, newName: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
  lastTodo: Todo;
  triggerConfetti: () => void;
}

// eslint-disable-next-line react/function-component-definition
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
  renameTodo,
  sortIndividualTodo,
  lastTodo,
  triggerConfetti,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);

  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      const timer = setTimeout(() => {
        editInputRef.current?.focus();
      }, 100); // Adjust the delay as needed
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isEditing]);

  const completeTodo = (id: string) => {
    toggleTodo(id);
    triggerConfetti();
  };

  const toggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleSubmit = (e) => {
    if (e.key === 'Enter' || e.type === 'blur') {
      // Assuming there's a function to update the todo title in the parent component
      renameTodo(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  const isDarkModeEnabled = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  return (
    <li id={todo.id} className="group -z-10">
      <ContextMenu>
        <ContextMenuTrigger>
          <div className="flex items-center justify-between min-h-10 gap-4 relative my-5 ">
            <div className="flex gap-4 items-center">
              <motion.div
                className="border-gray-800 ml-2 border w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-900  cursor-pointer dark:border-gray-100 dark:hover:bg-gray-100"
                onClick={() => completeTodo(todo.id)}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                whileHover={{ scale: [null, 1.5, 1.4] }}
                transition={{ duration: 0.3 }}
              >
                <Check
                  color={isDarkModeEnabled ? 'black' : 'white'}
                  className={isHover ? 'opacity-100' : 'opacity-0'}
                  size={14}
                />
              </motion.div>
              <div className="flex flex-col min-w-56 pr-14">
                {isEditing ? (
                  <input
                    ref={editInputRef}
                    type="text"
                    value={editedTitle}
                    onChange={handleTitleChange}
                    onKeyDown={handleTitleSubmit}
                    onBlur={handleTitleSubmit}
                    onFocus={(e) => e.target.select()}
                    className="form-input font-medium text-gray-800 break-words bg-transparent focus:outline-none dark:text-gray-100"
                  />
                ) : (
                  <p className="font-medium text-gray-800 break-words dark:text-gray-100 ">
                    {todo.title}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => sortIndividualTodo(todo)}
              className="hidden h-8 px-4 py-1 text-sm bg-gray-800 text-white rounded-md group-hover:flex absolute right-0 mr-2  items-center justify-center dark:bg-gray-200 dark:text-gray-800"
            >
              Sort
            </button>
            {todo.sorted ? '' : <AlertIcon />}
          </div>
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem onClick={() => toggleTodo(todo.id)}>
            Complete
          </ContextMenuItem>
          <ContextMenuItem onClick={toggleEdit}>Rename</ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem
            onClick={() => deleteTodo(todo.id)}
            className="text-red-500"
          >
            Delete
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>

      {todo === lastTodo ? (
        ''
      ) : (
        <div className="mt-2 mb-4  border-b  border-gray-800 opacity-10 dark:border-gray-100" />
      )}
    </li>
  );
};

interface ToDoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  renameTodo: (id: string, newName: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
  ref: React.RefObject<HTMLDivElement>;
}

function ToDoList({
  todos,
  toggleTodo,
  deleteTodo,
  renameTodo,
  sortIndividualTodo,
  ref,
}: ToDoListProps) {
  const todosLength = todos.length;
  const lastTodo = todos[todosLength - 1];
  const firstTodo = todos[0];
  const [showConfetti, setShowConfetti] = React.useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 1000);
  };

  const rotateRandomly = () => {
    const rotation = Math.floor(Math.random() * 360);
    return `rotate(${rotation}deg)`;
  };

  return (
    <div className="mx-8 mt-2 overflow-auto shrink min-h-0 min-w-0">
      {showConfetti ? (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none"
          style={{ transform: rotateRandomly() }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <Rive
              src={confettiAnimation}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      ) : (
        ''
      )}

      <ul>
        {todos.map((todo) =>
          todo.completed ? null : (
            <TodoItem
              key={todo.id}
              todo={todo}
              toggleTodo={toggleTodo}
              deleteTodo={deleteTodo}
              renameTodo={renameTodo}
              sortIndividualTodo={sortIndividualTodo}
              lastTodo={lastTodo}
              ref={todo.id === firstTodo.id ? ref : null}
              triggerConfetti={triggerConfetti}
            />
          ),
        )}
      </ul>
    </div>
  );
}

export default ToDoList;
