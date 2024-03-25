import React from 'react';
import { Todo } from './types';
import Rive from '@rive-app/react-canvas';
import confettiAnimation from './confetti.riv';
import AlertIcon from './icons/AlertIcon';
import { Check } from 'lucide-react';

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

  return (
    <li className="group -z-10">
      <div id="todo-single">
        <div
          className="flex items-center justify-between  gap-4 relative "
          onMouseEnter={() => setIsHover(true)}
          onMouseLeave={() => setIsHover(false)}
        >
          <div className="flex gap-4 min-h-10 items-center">
            <div
              className="border-gray-800 border w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center"
              onClick={() => completeTodo(todo.id)}
            >
              <Check
                className={isHover ? 'opacity-100' : 'opacity-0'}
                size={14}
              />
            </div>
            <div className="flex flex-col w-56">
              <p className="font-medium  text-gray-800 break-words">
                {todo.title}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => sortIndividualTodo(todo)}
            className="hidden h-8 px-4 py-1 text-sm bg-gray-800 text-white rounded-md group-hover:flex absolute right-0 items-center justify-center"
          >
            Sort
          </button>
          {todo.sorted ? '' : <AlertIcon />}
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
