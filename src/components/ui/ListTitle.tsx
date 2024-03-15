import { useState } from 'react';
import ListDropDown from './ListDropDown';

function ListTitle({ todoLists, cleanTodoListNames, listName, setListName }) {
  const [isHovered, setIsHovered] = useState(false);

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
        cleanTodoListNames={cleanTodoListNames}
        setListName={setListName}
        listName={listName}
      />
    </div>
  );
}

export default ListTitle;
