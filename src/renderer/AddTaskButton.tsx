/* eslint-disable jsx-a11y/no-autofocus */
/* eslint-disable react/function-component-definition */
import React, { useState } from 'react';
import PlusIcon from './PlusIcon';

interface AddTaskButtonProps {
  addTodo: (todo: string) => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ addTodo }) => {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const handleButtonClick = () => {
    setIsInputVisible(true);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleInputSubmit = () => {
    if (inputValue.trim() !== '') {
      addTodo(inputValue);
      setInputValue('');
      setIsInputVisible(false);
    }
  };

  const handleInputCancel = () => {
    setInputValue('');
    setIsInputVisible(false);
  };

  if (isInputVisible) {
    return (
      <div className="my-4 mx-7 p-1 flex flex-col gap-4 items-center rounded-md">
        <input
          className="rounded-md w-full p-1 outline-none"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              handleInputSubmit();
            }
          }}
          autoFocus
          placeholder="Task name"
        />
        <div className="flex w-full justify-between gap-2">
          <button
            className="w-full px-4 py-3 border border-gray-600 text-gray-900 rounded-md flex-grow"
            type="button"
            onClick={handleInputCancel}
          >
            Cancel
          </button>
          <button
            className="w-full px-4 py-3 bg-gray-900 text-white rounded-md flex-grow"
            type="button"
            onClick={handleInputSubmit}
          >
            Add
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="my-4 mx-7 p-1 flex gap-4 items-center cursor-pointer hover:bg-gray-50 rounded-md"
      onClick={handleButtonClick}
      role="button"
      tabIndex={0}
      aria-label="Add new todo"
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          handleButtonClick();
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
