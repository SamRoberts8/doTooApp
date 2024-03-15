import { useState } from 'react';
import ListDropDown from './ListDropDown';

function ListTitle() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div>
        <h1 className=" text-2xl font-bold">doToo List</h1>
        <h2 className="text-gray-800 opacity-40">Your relative todo list.</h2>
      </div>
      <ListDropDown isHovered={isHovered} setIsHovered={setIsHovered} />
    </div>
  );
}

export default ListTitle;
