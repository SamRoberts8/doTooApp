import { useState } from 'react';
import ListDropDown from './ListDropDown';

function ListTitle({
  todoLists,
  changeActiveList,
  addTodoListAndSetActive,
  currentListId,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const currentList = todoLists.find((list) => list.id === currentListId);
  const listName = currentList ? currentList.name : '';

  return (
    <div
      className="flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <h1 className=" text-2xl font-bold">{listName}</h1>
        <h2 className="text-gray-800 opacity-40">Your relative todo list.</h2>
      </div>
      <ListDropDown
        isHovered={isHovered}
        setIsHovered={setIsHovered}
        todoLists={todoLists}
        changeActiveList={changeActiveList}
        addTodoListAndSetActive={addTodoListAndSetActive}
        currentListId={currentListId}
      />
    </div>
  );
}

export default ListTitle;
