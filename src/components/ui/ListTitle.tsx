/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useState } from 'react';
import ListDropDown from './ListDropDown';
import { Todo, TodoList } from '../../renderer/types';

interface ListTitleProps {
  todoLists: TodoList[];
  changeActiveList: (listId: string) => void;
  addTodoListAndSetActive: () => void;
  currentListId: string;
  todos: Todo[];
  completedTodos: Todo[];
  setMode: (mode: string) => void;
}

function ListTitle({
  todoLists,
  changeActiveList,
  addTodoListAndSetActive,
  currentListId,
  todos,
  completedTodos,
  setMode,
}: ListTitleProps) {
  const [isHovered, setIsHovered] = useState(false);
  const currentList = todoLists.find((list) => list.id === currentListId);
  const listName = currentList ? currentList.name : '';

  const todosLength = todos.length;
  const completedTodosLength = completedTodos.length;
  const completedTodoThisWeek = completedTodos.filter((todo) => {
    const today = new Date();
    const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));
    const completedAt = todo.completedAt ? new Date(todo.completedAt) : null;
    return completedAt && completedAt > sevenDaysAgo;
  });
  const completedTodoThisWeekLength = completedTodoThisWeek.length;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-row">
        <h1 className="text-2xl font-bold">{listName}</h1>
        <div className="ml-2">
          <ListDropDown
            isHovered={isHovered}
            setIsHovered={setIsHovered}
            todoLists={todoLists}
            changeActiveList={changeActiveList}
            addTodoListAndSetActive={addTodoListAndSetActive}
            currentListId={currentListId}
          />
        </div>
      </div>
      <h2 className="text-gray-800 opacity-40 text-sm mt-1">
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setMode('view')}
        >
          {todosLength} doToos,
        </span>{' '}
        <span
          className="cursor-pointer hover:underline"
          onClick={() => setMode('completed')}
        >
          {completedTodoThisWeekLength} completed this week,{' '}
          {completedTodosLength} all-time.
        </span>
      </h2>
    </div>
  );
}

export default ListTitle;
