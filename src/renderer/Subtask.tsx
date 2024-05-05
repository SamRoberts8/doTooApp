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

interface SubTaskItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  renameTodo: (id: string, newName: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
  lastTodo: Todo;
  addSubTaskToTodo: (title: string, todoId: string) => void;
  setShowAddSubtask: (show: boolean) => void;
  setAddingSubtaskParentId: (id: string) => void;
}

// eslint-disable-next-line react/function-component-definition
const SubTaskItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  deleteTodo,
  renameTodo,
  sortIndividualTodo,
  lastTodo,
  addSubTaskToTodo,
  setShowAddSubtask,
  setAddingSubtaskParentId,
}) => {
  const [isHover, setIsHover] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const editInputRef = useRef<HTMLInputElement>(null);
  const checkLocationRef = useRef<HTMLInputElement>(null);

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
  };

  const triggerConfettiAndComplete = (id: string) => {
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
      completeTodo(id);
    }, 1000);
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

  const checkLocation = checkLocationRef.current?.getBoundingClientRect();

  const checkHeight = checkLocation ? checkLocation?.height : 0;
  const checkWidth = checkLocation ? checkLocation?.width : 0;

  const confettiSize = 384;
  const centerPosition = checkLocation
    ? {
        left: checkLocation.left + (checkWidth - confettiSize) / 2,
        top: checkLocation.top + (checkHeight - confettiSize) / 2,
      }
    : null;

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const handleSubstaskClick = (todoId: string) => {
    setShowAddSubtask(true);
    setAddingSubtaskParentId(todoId);
  };

  return (
    <li id={todo.id} className="group -z-10">
      {showConfetti ? (
        <div
          className="fixed inset-0 z-50 pointer-events-none"
          style={{
            left: `${centerPosition?.left}px`,
            top: `${centerPosition?.top}px`,
          }}
        >
          <div className=" w-96 h-96 flex justify-center items-center">
            <Rive
              src={confettiAnimation}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      ) : (
        ''
      )}
      <ContextMenu>
        <ContextMenuTrigger>
          <motion.div
            className="flex items-center justify-between min-h-10 gap-4 relative my-1 "
            animate={showConfetti ? 'hidden' : 'visible'}
            variants={variants}
          >
            <div className="flex gap-4 items-center">
              <motion.div
                className="border-gray-800 ml-2 border w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-900  cursor-pointer dark:border-gray-100 dark:hover:bg-gray-100"
                onClick={() => triggerConfettiAndComplete(todo.id)}
                onMouseEnter={() => setIsHover(true)}
                onMouseLeave={() => setIsHover(false)}
                whileHover={{ scale: [null, 1.4, 1.3] }}
                transition={{ duration: 0.3 }}
                ref={checkLocationRef}
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
                    className="form-input font-medium text-gray-800 break-all bg-transparent focus:outline-none dark:text-gray-100"
                    spellCheck="true"
                  />
                ) : (
                  <div>
                    <p className="font-medium text-gray-800 break-all dark:text-gray-100 ">
                      {todo.title}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </ContextMenuTrigger>
        <ContextMenuContent spellCheck="true">
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

export default SubTaskItem;
