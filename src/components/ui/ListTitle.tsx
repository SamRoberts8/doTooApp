/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import ListDropDown from './ListDropDown';
import { Todo, TodoList } from '../../renderer/types';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './hover-card';
import { Search } from 'lucide-react';

interface ListTitleProps {
  todoLists: TodoList[];
  changeActiveList: (listId: string) => void;
  addTodoListAndSetActive: () => void;
  currentListId: string;
  todos: Todo[];
  completedTodos: Todo[];
  setMode: (mode: string) => void;
  renameTodoList: (listId: string, name: string) => void;
  deleteTodoList: (listId: string) => void;
}

function ListTitle({
  todoLists,
  changeActiveList,
  addTodoListAndSetActive,
  currentListId,
  todos,
  completedTodos,
  setMode,
  renameTodoList,
  deleteTodoList,
}: ListTitleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [open, setOpen] = useState(false);
  const currentList = todoLists.find((list) => list.id === currentListId);
  const listName = currentList ? currentList.name : '';

  const todosLength = todos.length;

  const completedTodoTodayLength = completedTodos.filter((todo) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;
    return completedAt && completedAt >= today;
  }).length;

  const completedTodoPastWeekLength = completedTodos.filter((todo) => {
    const today = new Date();
    const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;
    const pastWeek = new Date(today.setDate(today.getDate() - 7));
    return completedAt && completedAt >= pastWeek;
  }).length;

  const completedTodoPastMonthLength = completedTodos.filter((todo) => {
    const today = new Date();
    const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;
    const pastMonth = new Date(today.setDate(today.getDate() - 28));
    return completedAt && completedAt >= pastMonth;
  }).length;

  const completedTodoAllTimeLenght = completedTodos.length;

  return (
    <div className="w-[80%]">
      <div
        className="flex flex-row"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <h1
          className="text-2xl font-bold dark:text-gray-100"
          onClick={() => setOpen(!open)}
        >
          {listName}
        </h1>
        <div className="ml-2">
          <ListDropDown
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            todoLists={todoLists}
            changeActiveList={changeActiveList}
            addTodoListAndSetActive={addTodoListAndSetActive}
            currentListId={currentListId}
            open={open}
            setOpen={setOpen}
            renameTodoList={renameTodoList}
            deleteTodoList={deleteTodoList}
          />
        </div>
      </div>
      <div className="flex justify-between w-full items-center">
        <h2 className="text-gray-900  text-sm mt-1 dark:text-gray-100">
          <span
            className="cursor-pointer opacity-70 hover:underline "
            onClick={() => setMode('view')}
          >
            {todosLength} doToos,
          </span>{' '}
          <HoverCard>
            <HoverCardTrigger>
              <span
                className="cursor-pointer opacity-70 hover:underline"
                onClick={() => setMode('completed')}
              >
                {completedTodoTodayLength} completed today.
              </span>
            </HoverCardTrigger>
            <HoverCardContent className="my-2">
              <h3 className="font-bold">Completed Tasks Summary</h3>
              <p className="mt-2">{completedTodoTodayLength} today.</p>
              <p className="mt-1">{completedTodoPastWeekLength} past week.</p>
              <p className="mt-1">{completedTodoPastMonthLength} past month.</p>
              <p className="mt-1">{completedTodoAllTimeLenght} all time.</p>
            </HoverCardContent>
          </HoverCard>
        </h2>
        <Search size={18} />
      </div>
    </div>
  );
}

export default ListTitle;
