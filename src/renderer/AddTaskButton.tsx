/* eslint-disable react/function-component-definition */
import React from 'react';
import PlusIcon from './PlusIcon';

interface AddTaskButtonProps {
  addTodo: (todo: string) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ addTodo }) => {
  return (
    <div
      className="my-3 mx-7  p-1 flex gap-4 items-center cursor-pointer hover:bg-gray-50 rounded-md"
      onClick={() => addTodo('New Todo')}
      role="button" // Indicate that the div acts as a button
      tabIndex={0} // Make the div focusable
      aria-label="Add new todo" // Provide an accessible name
      onKeyDown={(event) => {
        // Trigger the action on 'Enter' or 'Space' key press
        if (event.key === 'Enter' || event.key === ' ') {
          addTodo('New Todo');
        }
      }}
    >
      <div>
        <PlusIcon />
      </div>
      <div>
        <p className="text-sm text-gray-600">Add task</p>
      </div>
    </div>
  );
};

export default AddTaskButton;
