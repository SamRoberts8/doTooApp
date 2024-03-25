import React, { useState, useRef, useEffect } from 'react';
import Rive from '@rive-app/react-canvas';
import confettiAnimation from './confetti.riv';
import AlertIcon from './icons/AlertIcon';
import { Check } from 'lucide-react';
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
  sortIndividualTodo: (todoToSort: Todo) => void;
  lastTodo: Todo;
  triggerConfetti: () => void;
}

// eslint-disable-next-line react/function-component-definition
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
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
      console.log(todo.id, editedTitle);
      setIsEditing(false);
    }
  };

  return (
    <li id={todo.id} className="group -z-10">
      <ContextMenu>
        <ContextMenuTrigger>
          <div
            className="flex items-center justify-between min-h-10 gap-4 relative "
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
          >
            <div className="flex gap-4 items-center">
              <div
                className="border-gray-800 border w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center"
                onClick={() => completeTodo(todo.id)}
              >
                <Check
                  className={isHover ? 'opacity-100' : 'opacity-0'}
                  size={14}
                />
              </div>
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
                    className="form-input font-medium text-gray-800 break-words bg-transparent focus:outline-none"
                  />
                ) : (
                  <p className="font-medium text-gray-800 break-words">
                    {todo.title}
                  </p>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => sortIndividualTodo(todo)}
              className="hidden h-8 px-4 py-1 text-sm bg-gray-800 text-white rounded-md group-hover:flex absolute right-0 mr-2  items-center justify-center"
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
        <div className="mt-2 mb-4  border-b  border-gray-800 opacity-10" />
      )}
    </li>
  );
};

interface ToDoListProps {
  todos: Todo[];
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
  ref: React.RefObject<HTMLDivElement>;
}

function ToDoList({
  todos,
  toggleTodo,
  deleteTodo,
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
    <div className="mx-8 mt-6 overflow-auto  shrink min-h-0 min-w-0">
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
