/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React from 'react';
import { Todo } from './types';
import Rive from '@rive-app/react-canvas';
import confettiAnimation from './confetti.riv';
import AlertIcon from './icons/AlertIcon';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface TodoItemProps {
  todo: Todo;
  toggleTodo: (id: string) => void;
  sortIndividualTodo: (todoToSort: Todo) => void;
  lastTodo: Todo;
  triggerConfetti: () => void;
}

// eslint-disable-next-line react/function-component-definition
const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  toggleTodo,
  sortIndividualTodo,
  lastTodo,
  triggerConfetti,
}) => {
  const [isHover, setIsHover] = React.useState(false);

  const completeTodo = (id: string) => {
    toggleTodo(id);
    triggerConfetti();
  };

  const isDarkModeEnabled = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches;

  return (
    <li className="group -z-10">
      <div id="todo-single">
        <div className="flex items-center justify-between min-h-10 gap-4 relative my-5 ">
          <div className="flex gap-4 items-center">
            <motion.div
              className="border-gray-800  ml-2 border w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center hover:bg-gray-900 cursor-pointer dark:border-gray-100 dark:hover:bg-gray-100"
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
            <div className="flex flex-col w-56">
              <p className="font-medium  text-gray-800 break-words dark:text-gray-100">
                {todo.title}
              </p>
            </div>
          </div>
        </div>
      </div>
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
  sortIndividualTodo: (todoToSort: Todo) => void;
}

function ToDoListSingle({
  todos,
  toggleTodo,
  sortIndividualTodo,
}: ToDoListProps) {
  const todosLength = todos.length;
  const lastTodo = todos[todosLength - 1];
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
    <div className="mx-8 overflow-auto  shrink min-h-0 min-w-0">
      {showConfetti ? (
        <div
          className="fixed inset-0 z-50 flex justify-center items-center pointer-events-none"
          style={{ transform: rotateRandomly() }}
        >
          <div className="w-full h-full flex justify-center items-center">
            <Rive
              src={confettiAnimation}
              style={{ width: '100%', height: '400%' }}
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
              sortIndividualTodo={sortIndividualTodo}
              lastTodo={lastTodo}
              triggerConfetti={triggerConfetti}
            />
          ),
        )}
      </ul>
    </div>
  );
}

export default ToDoListSingle;
